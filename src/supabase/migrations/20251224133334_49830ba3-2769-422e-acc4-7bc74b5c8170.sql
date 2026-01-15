-- Insert admin emails into allowed_admin_emails table
INSERT INTO public.allowed_admin_emails (email) VALUES
('anoop.dutt.editor@gmail.com'),
('lilynexmedia@gmail.com'),
('kumbhaa167@gmail.com'),
('himanshupanditz1209@gmail.com'),
('anoopsonkriya024@gmail.com')
ON CONFLICT DO NOTHING;