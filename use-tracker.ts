import { useState } from 'react'
import { removeTracked, setTracked, type TrackStatus, type TrackedItem } from './tracker'

/** Optimistic client-side view of the signed-in student's tracker rows. */
export function useTracker(initial: TrackedItem[]) {
  const [items, setItems] = useState<Record<string, TrackedItem>>(() =>
    Object.fromEntries(initial.map((i) => [i.opportunityId, i])),
  )

  const update = async (opportunityId: string, status: TrackStatus, notes?: string) => {
    const prev = items[opportunityId]
    setItems((s) => ({
      ...s,
      [opportunityId]: {
        opportunityId,
        status,
        notes: notes ?? prev?.notes ?? '',
        updatedAt: new Date().toISOString(),
      },
    }))
    try {
      await setTracked({ data: { opportunityId, status, notes } })
    } catch {
      setItems((s) => {
        const next = { ...s }
        if (prev) next[opportunityId] = prev
        else delete next[opportunityId]
        return next
      })
    }
  }

  const remove = async (opportunityId: string) => {
    const prev = items[opportunityId]
    setItems((s) => {
      const next = { ...s }
      delete next[opportunityId]
      return next
    })
    try {
      await removeTracked({ data: { opportunityId } })
    } catch {
      if (prev) setItems((s) => ({ ...s, [opportunityId]: prev }))
    }
  }

  return { items, update, remove }
}
