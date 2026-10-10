import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

// One row per (user, opportunity) the user has saved or applied to.
// Opportunity content itself lives in src/data/opportunities.ts.
export const trackedOpportunities = pgTable(
  'tracked_opportunities',
  {
    id: serial().primaryKey(),
    userId: text('user_id').notNull(),
    opportunityId: text('opportunity_id').notNull(),
    status: text().notNull().default('saved'),
    notes: text().notNull().default(''),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('tracked_user_opportunity_idx').on(t.userId, t.opportunityId)],
)
