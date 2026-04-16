-- Enable pg_cron for scheduled database jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
GRANT USAGE ON SCHEMA cron TO postgres;

-- Enable pg_net for async HTTP requests from the database
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Wrapper function: reads Vault secrets and invokes the edge function via pg_net
CREATE OR REPLACE FUNCTION public.invoke_send_daily_checkin()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  base_url  TEXT;
  svc_key   TEXT;
  request_id BIGINT;
BEGIN
  SELECT decrypted_secret INTO base_url
    FROM vault.decrypted_secrets
   WHERE name = 'app_url';

  SELECT decrypted_secret INTO svc_key
    FROM vault.decrypted_secrets
   WHERE name = 'app_service_role_key';

  IF base_url IS NULL OR svc_key IS NULL THEN
    RAISE EXCEPTION 'Missing vault secrets: app_url and/or app_service_role_key';
  END IF;

  SELECT net.http_post(
    url     := base_url || '/functions/v1/send-daily-checkin',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || svc_key,
      'Content-Type',  'application/json'
    ),
    body    := jsonb_build_object('triggered_at', NOW())
  ) INTO request_id;

  RETURN request_id;
END;
$$;

-- Schedule daily at 09:00 UTC
SELECT cron.schedule(
  'send-daily-checkin-emails',
  '0 9 * * *',
  'SELECT public.invoke_send_daily_checkin()'
);
