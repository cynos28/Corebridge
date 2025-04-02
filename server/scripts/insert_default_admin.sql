INSERT INTO users (id, username, password, role)
VALUES ('Admin1234', 'Admin1234', 'Admin@1234', 'admin')
ON CONFLICT (id) DO NOTHING;
