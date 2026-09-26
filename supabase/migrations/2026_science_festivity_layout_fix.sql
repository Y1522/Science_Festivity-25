-- ============================================================
-- Science Festivity 2026 -- floor-plan correction (follow-up to
-- 2026_science_festivity_data_fix.sql)
--
-- The physical floor plan images changed and the booth positions moved
-- with them. As a result:
--   • Booth 13 no longer fits inside "خيمة بوابة الكون" (Gateway to the
--     Universe) and has physically moved into "خيمة مرصد السماء" (Sky
--     Observatory). Its content (institution/activity row) is unchanged —
--     only which tent it belongs to changes.
--   • Booths 11 and 12 no longer exist anywhere in the new floor plan —
--     there is no space for them in any tent. They are removed entirely,
--     which also removes their booth_activities rows (both were the same
--     institution: "المكتبات المتخصصة، مكتبة الإسكندرية").
--
-- NOTE: removing booths 11/12 drops that institution's session from the
-- map completely. If "المكتبات المتخصصة، مكتبة الإسكندرية" still needs a
-- spot somewhere, tell me which booth/tent and I'll re-add it there instead
-- of deleting it outright.
--
-- Safe to re-run (idempotent): the UPDATE is a no-op if already applied,
-- and the DELETEs are no-ops once the rows are gone.
-- ============================================================

begin;

-- Booth 13: بوابة الكون -> مرصد السماء
update public.booths
set zone_id = (select zone_id from public.zones where zone_code = 'sky_observatory')
where booth_number = 13;

-- Booths 11 and 12: removed from the venue entirely
delete from public.booth_activities where booth_number in (11, 12);
delete from public.booths where booth_number in (11, 12);

commit;
