import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { trackedOpportunities } from '../../db/schema.js'
import { requireAuthMiddleware } from '../middleware/identity'

export const STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'] as const
export type TrackStatus = (typeof STATUSES)[number]

export interface TrackedItem {
  opportunityId: string
  status: TrackStatus
  notes: string
  updatedAt: string
}

export const listTracked = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }): Promise<TrackedItem[]> => {
    const rows = await db
      .select()
      .from(trackedOpportunities)
      .where(eq(trackedOpportunities.userId, context.user.id))
      .orderBy(desc(trackedOpportunities.updatedAt))
    return rows.map((r) => ({
      opportunityId: r.opportunityId,
      status: r.status as TrackStatus,
      notes: r.notes,
      updatedAt: r.updatedAt.toISOString(),
    }))
  })

export const setTracked = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator(
    z.object({
      opportunityId: z.string().min(1).max(100),
      status: z.enum(STATUSES),
      notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const now = new Date()
    await db
      .insert(trackedOpportunities)
      .values({
        userId: context.user.id,
        opportunityId: data.opportunityId,
        status: data.status,
        notes: data.notes ?? '',
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [trackedOpportunities.userId, trackedOpportunities.opportunityId],
        set: {
          status: data.status,
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
          updatedAt: now,
        },
      })
    return { ok: true }
  })

export const removeTracked = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator(z.object({ opportunityId: z.string().min(1).max(100) }))
  .handler(async ({ context, data }) => {
    await db
      .delete(trackedOpportunities)
      .where(
        and(
          eq(trackedOpportunities.userId, context.user.id),
          eq(trackedOpportunities.opportunityId, data.opportunityId),
        ),
      )
    return { ok: true }
  })
