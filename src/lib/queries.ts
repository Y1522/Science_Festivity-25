import { supabase } from './supabaseClient'
import type { Booth, Zone } from './types'

export async function fetchZones(): Promise<Zone[]> {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .order('zone_id', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchBoothsByZone(zoneCode: string): Promise<Booth[]> {
  // Step 1: resolve zone_id from zone_code — أوثق من فلترة الـ joined table مباشرة
  const { data: zoneRow, error: zoneErr } = await supabase
    .from('zones')
    .select('zone_id')
    .eq('zone_code', zoneCode)
    .single()

  if (zoneErr) throw zoneErr
  if (!zoneRow) return []

  // Step 2: جيب الأكشاك بـ zone_id مباشرة — مفيش join filter
  const { data, error } = await supabase
    .from('booths')
    .select('*, activities:booth_activities(*), zone:zones(*)')
    .eq('zone_id', zoneRow.zone_id)
    .order('booth_number', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchBooth(boothNumber: number): Promise<Booth | null> {
  const { data, error } = await supabase
    .from('booths')
    .select('*, activities:booth_activities(*), zone:zones(*)')
    .eq('booth_number', boothNumber)
    .single()

  if (error) throw error
  return data
}

export async function fetchScheduleEvents() {
  console.warn('fetchScheduleEvents: schedule_events table does not exist in the new schema yet.')
  return []
}