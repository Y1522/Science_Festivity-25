// Types matching the Science Festivity 2026 Supabase schema
// (zones / booths / booth_activities / event_info)
// Generated from science_festivity_2026_booths.sql

export type ActivityType = 'Workshop' | 'Presentation' | 'Storytelling' | null

// NOTE: in the new schema, target audience is festival-wide (stored once in
// event_info), not per booth — the source leaflet only listed one audience
// list for the whole event, not a breakdown per booth. Kept here for any UI
// that still wants to render the full list as static copy.
export type AudienceLevel =
  | 'kindergarten'
  | 'primary'
  | 'preparatory'
  | 'secondary_university'
  | 'people_of_determination'

// was: Tent
export interface Zone {
  zone_id: number
  zone_code: string
  name_ar: string
  name_en: string
}

// was: Institution + Session merged into one row, one-to-many per booth
export interface BoothActivity {
  activity_id: number
  booth_number: number
  institution_ar: string | null
  institution_en: string | null
  activity_type_ar: string | null
  activity_type_en: ActivityType
  activity_dates: string | null   // free text, e.g. "26 September" or "27-28 September"; null = all festival days
  description_ar: string | null
  description_en: string | null
}

// was: Booth
export interface Booth {
  booth_number: number            // primary/lookup key — never translated
  zone_id: number | null
  zone?: Zone
  activities?: BoothActivity[]    // one-to-many
}

// new: festival-wide metadata (currently just event name + target audience)
export interface EventInfo {
  info_key: string
  value_ar: string | null
  value_en: string | null
}

// matches the `booth_details` SQL view — flattened, ready to filter by
// booth_number without a manual join
export interface BoothDetailRow {
  booth_number: number
  zone_code: string | null
  zone_name_ar: string | null
  zone_name_en: string | null
  activity_id: number | null
  institution_ar: string | null
  institution_en: string | null
  activity_type_ar: string | null
  activity_type_en: ActivityType
  activity_dates: string | null
  description_ar: string | null
  description_en: string | null
}