-- Enable CORS for your domain
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Set CORS policy for the entire API
ALTER SYSTEM SET cors.allowed_origins TO '*';
-- For production, you should restrict this to your domains:
-- ALTER SYSTEM SET cors.allowed_origins TO 'https://your-domain.com,https://www.your-domain.com';

-- Set other CORS settings
ALTER SYSTEM SET cors.allowed_methods TO 'GET,POST,PUT,DELETE,OPTIONS';
ALTER SYSTEM SET cors.allowed_headers TO 'Authorization,Content-Type,Accept,Origin,User-Agent';
ALTER SYSTEM SET cors.exposed_headers TO 'Content-Length,Content-Range';
ALTER SYSTEM SET cors.max_age TO '3600';
