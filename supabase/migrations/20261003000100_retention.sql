-- Delete AI demo runs older than 90 days (privacy policy promise).
-- pg_cron is available on Supabase (including the free plan) and in the local stack.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'purge-old-ai-demo-runs',
  '15 3 * * *', -- daily at 03:15 UTC
  $$ delete from public.ai_demo_runs where created_at < now() - interval '90 days' $$
);
