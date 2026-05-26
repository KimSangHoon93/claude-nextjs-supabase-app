-- =============================================================================
-- Migration 001: 초기 스키마 설계
-- Gather 플랫폼 핵심 테이블 생성
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. profiles 테이블 확장: role 컬럼 추가
-- -----------------------------------------------------------------------------
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin'));

-- -----------------------------------------------------------------------------
-- 2. events 테이블 생성
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  description     TEXT,
  location        TEXT        NOT NULL,
  event_date      TIMESTAMPTZ NOT NULL,
  cover_image_url TEXT,
  invite_code     TEXT        NOT NULL UNIQUE,
  status          TEXT        NOT NULL DEFAULT 'upcoming'
                  CHECK (status IN ('upcoming', 'ongoing', 'ended')),
  created_by      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. event_participants 테이블 생성
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_participants (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL DEFAULT 'participant'
             CHECK (role IN ('host', 'participant')),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 4. 인덱스 생성
-- -----------------------------------------------------------------------------

-- events 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_events_invite_code  ON events(invite_code);
CREATE INDEX IF NOT EXISTS idx_events_created_by   ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_status_date  ON events(status, event_date);

-- event_participants 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_participants_event_id    ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id     ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_role  ON event_participants(event_id, role);

-- -----------------------------------------------------------------------------
-- 5. updated_at 자동 갱신 트리거
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- 6. participant_count 집계 뷰 생성
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW events_with_count AS
SELECT
  e.*,
  COUNT(ep.id)::INTEGER AS participant_count
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
GROUP BY e.id;
