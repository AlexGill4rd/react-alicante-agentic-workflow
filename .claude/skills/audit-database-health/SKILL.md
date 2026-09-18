---
name: audit-database-health
description: Invoke automatically after any migration file is created or modified. Audits the Supabase database for migration drift, tables missing RLS, and unindexed foreign keys.

metadata:
  domain: database
  trigger: both
  priority: medium
  blocking: false
---

# Skill: Database Health Check

## When to use
- Before a release to catch schema issues before they reach production
- After adding new tables or migrations
- When investigating slow queries or access control issues
- Periodically as a routine health check

## Inputs
- `$ARGUMENTS` (optional): focus area — `rls`, `indexes`, `migrations`, or omit to run all three

## Workflow

### 1. Migration drift
Ask the user to run this themselves and share the output — it connects to the linked project:
```bash
cd apps/academy && pnpm db:migrations:list
```
- Every row must have both a Local and Remote timestamp.
- **Local only (no Remote):** migration exists in files but has not been applied to QA — ask the user to run `pnpm db:push`.
- **Remote only (no Local):** migration was applied manually via SQL editor and has no file — create the corresponding `.sql` file to bring git back in sync.
- Report any mismatches clearly.

### 2. RLS audit
Query the linked Supabase project to find tables with RLS disabled:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;
```
- Any table returned here is exposed — anon can read all rows via the Supabase REST API with no policy guard.
- For each table found: check whether it is intentionally public (e.g. a read-only reference table) or a security gap.
- Report findings with a recommendation for each table.

### 3. Index audit
Query for foreign key columns that lack a supporting index (common source of slow joins):
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON rc.unique_constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = tc.table_name
      AND indexdef LIKE '%' || kcu.column_name || '%'
  )
ORDER BY tc.table_name;
```
- Each result is a foreign key column with no index — joins and lookups on that column will do full table scans.
- Recommend a migration to add the missing index for each one found.

## How to run the SQL queries
These are read-only queries, so the SQL editor is fine here (unlike DDL). Give the user the query and ask them to run it in the Supabase dashboard SQL editor for the linked project and paste back the result — do not run it yourself and do not delegate execution to `database-manager` either; that agent never runs commands against a linked project.

## Output
A report with three sections:
- **Migrations:** ✅ in sync / ⚠️ list of drifted migrations with action
- **RLS:** ✅ all tables protected / ⚠️ list of exposed tables with recommendation
- **Indexes:** ✅ no missing indexes / ⚠️ list of unindexed foreign keys with suggested migration SQL

## Constraints
- Do not apply any fixes automatically — report findings and propose the SQL, let the user decide.
- Do not run `db:push` — this skill is read-only diagnostics only.
- For index recommendations, generate the migration SQL but do not write the file unless asked.

---

_Authored by Philomath Academy — Evangelia Mitsopoulou. Shared for the React Alicante workshop._
