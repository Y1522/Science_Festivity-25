import type { ActivityType } from './types'

// Keys now match booth_activities.activity_type_en exactly ('Workshop' /
// 'Presentation' / 'Storytelling'). There's no 'other' value in the new
// schema — every activity in the leaflet fell into one of these three types.
export const activityLabel: Record<Exclude<ActivityType, null>, string> = {
  Workshop: 'ورشة عمل',
  Presentation: 'عرض تقديمي',
  Storytelling: 'سرد قصصي',
}

// formatSessionDate() and formatDuration() have been removed:
//  - there is no `session_date` (ISO date) anymore — the new field,
//    booth_activities.activity_dates, is already a display-ready string
//    (e.g. "26 September", "27-28 September", or null for "all days"), so
//    it's rendered directly wherever it's used instead of being formatted.
//  - there is no `duration_minutes` anywhere in the new schema — the
//    leaflet never gave session lengths, so nothing computes this anymore.
// If any other file still imports these, that import is the signal for
// what still needs to be migrated to the new fields.