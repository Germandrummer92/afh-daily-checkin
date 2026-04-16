-- Vault secrets for local development
-- In production, set these via the Supabase Dashboard > Project Settings > Vault
SELECT vault.create_secret(
  'http://kong:8000',
  'app_url',
  'Supabase API gateway URL for internal edge function calls'
);

SELECT vault.create_secret(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
  'app_service_role_key',
  'Supabase service role key for edge function authorization'
);
