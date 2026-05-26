-- =============================================================================
-- Migration 002: Row Level Security 정책 설정
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. profiles 테이블 RLS
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자는 모든 프로필 읽기 가능 (참여자 목록 표시 등)
CREATE POLICY "profiles_read_authenticated"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- 자신의 프로필만 수정 가능
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. events 테이블 RLS
-- -----------------------------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 비로그인 포함 누구나 읽기 가능 (초대 링크 공개 접근 지원)
CREATE POLICY "events_read_all"
  ON events FOR SELECT
  USING (true);

-- 인증된 사용자만 이벤트 생성 가능 (자신이 created_by여야 함)
CREATE POLICY "events_insert_authenticated"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- 이벤트 생성자만 수정 가능
CREATE POLICY "events_update_own"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- 이벤트 생성자만 삭제 가능
CREATE POLICY "events_delete_own"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- -----------------------------------------------------------------------------
-- 3. event_participants 테이블 RLS
-- -----------------------------------------------------------------------------
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- 비로그인 포함 누구나 참여자 목록 읽기 가능 (이벤트 상세 페이지)
CREATE POLICY "participants_read_all"
  ON event_participants FOR SELECT
  USING (true);

-- 인증된 사용자는 자신을 참여자로 추가 가능
CREATE POLICY "participants_insert_self"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 자신의 참여 기록만 삭제 가능
CREATE POLICY "participants_delete_self"
  ON event_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
