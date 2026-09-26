import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error('Missing env vars. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Confirmed available to this project's key as of 2026-09-17 (GET
// /v1beta/models). text-embedding-004 was retired — if this 404s again,
// re-check https://generativelanguage.googleapis.com/v1beta/models?key=...
// for a model whose supportedGenerationMethods includes "embedContent".
const EMBEDDING_MODEL = 'gemini-embedding-001';

// Gemini's free tier is rate-limited per minute — this delay keeps us
// comfortably under it. Raise it if you see 429 errors.
const DELAY_MS = 250;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function embedText(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // gemini-embedding-001 defaults to 3072 dims but supports truncating
      // to 768/1536/3072 via outputDimensionality — 768 matches the
      // vector(768) columns in Postgres (and the edge function's queries).
      body: JSON.stringify({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Embedding request failed: ${await res.text()}`);
  }
  const data = await res.json();
  return data.embedding.values; // number[] of length 768
}

async function processTable({ table, idColumn, buildText }) {
  const { data: rows, error } = await supabase
    .from(table)
    .select('*')
    .is('embedding', null);

  if (error) {
    console.error(`Failed to fetch ${table}:`, error.message);
    return;
  }

  console.log(`${table}: ${rows.length} row(s) missing embeddings`);

  for (const row of rows) {
    const rowId = row[idColumn];
    const text = buildText(row);
    if (!text || !text.trim()) {
      console.log(`  skip ${rowId} — no text to embed`);
      continue;
    }

    try {
      const vector = await embedText(text);

      const { error: updateError } = await supabase
        .from(table)
        .update({ embedding: vector })
        .eq(idColumn, rowId);

      if (updateError) {
        console.error(`  ${rowId}: update failed —`, updateError.message);
      } else {
        console.log(`  ${rowId}: embedded (${vector.length} dims)`);
      }
    } catch (err) {
      console.error(`  ${rowId}: embedding failed —`, err.message);
    }

    await sleep(DELAY_MS);
  }
}

async function main() {
  // booth_activities (was `sessions`): combine institution name + description.
  // There's no `title` field anymore, and this app is Arabic-first, so we
  // embed the Arabic text — that's also what visitors will type questions in.
  await processTable({
    table: 'booth_activities',
    idColumn: 'activity_id',
    buildText: (row) => [row.institution_ar, row.activity_type_ar, row.description_ar].filter(Boolean).join('\n'),
  });

  // schedule_events: this table doesn't exist in the database yet (only
  // proposed in schedule_events_schema.sql, never applied — see the earlier
  // note about the missing Lecture Hall / Outdoor Stage content). Skip it
  // gracefully rather than crashing the whole backfill run.
  try {
    await processTable({
      table: 'schedule_events',
      idColumn: 'id',
      buildText: (row) => [row.activity_name, row.description].filter(Boolean).join('\n'),
    });
  } catch (err) {
    console.log('schedule_events: skipped (table likely does not exist yet) —', err.message);
  }

  console.log('Done.');
}

main();