CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority VARCHAR(50) NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
('Design new landing page', 'Create wireframes and mockups for the homepage.', 'in_progress', 'high', '2026-06-05'),
('Set up CI/CD pipeline', 'Configure GitHub Actions for automated deployment.', 'todo', 'high', '2026-06-10'),
('Write unit tests', 'Cover auth flows with Jest and React Testing Library.', 'todo', 'medium', '2026-06-08'),
('Fix payment gateway bug', 'Stripe webhook not firing on subscription renewals.', 'in_progress', 'high', '2026-05-31'),
('Update API documentation', 'Sync Swagger docs with v2.3 endpoint changes.', 'completed', 'low', '2026-05-28'),
('Migrate database', 'Move from SQLite to PostgreSQL for scalability.', 'todo', 'high', '2026-06-20'),
('Implement dark mode', 'Add system-level dark/light mode with toggle.', 'completed', 'medium', '2026-05-25'),
('Optimize image loading', 'Lazy loading + WebP conversion + CDN caching.', 'completed', 'medium', '2026-05-27'),
('Conduct user interviews', 'Run 5 user interviews on new onboarding flow.', 'in_progress', 'medium', '2026-06-03'),
('Add multi-language support', 'Integrate i18n for EN, ES, FR, AR.', 'todo', 'low', '2026-07-01');
