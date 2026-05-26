-- =============================================================================
-- Migration 003: Storage 버킷 및 Realtime 설정
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. event-covers Storage 버킷 생성
-- 주의: Supabase Storage 버킷은 대시보드 또는 Management API로 생성 권장
--       아래 SQL은 직접 storage.buckets 테이블에 삽입하는 방식 (MCP 실행 시 사용)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-covers',
  'event-covers',
  false,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Storage 정책 설정
-- 파일 경로 구조: {user_id}/{event_id}/{filename}.{ext}
-- -----------------------------------------------------------------------------

-- 누구나 이미지 읽기 가능 (커버 이미지 공개 표시)
CREATE POLICY "event_covers_read_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-covers');

-- 인증된 사용자만 자신의 폴더에 업로드 가능
CREATE POLICY "event_covers_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'event-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 자신이 업로드한 파일만 수정 가능
CREATE POLICY "event_covers_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'event-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 자신이 업로드한 파일만 삭제 가능
CREATE POLICY "event_covers_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'event-covers'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- -----------------------------------------------------------------------------
-- 3. Realtime 활성화: event_participants 테이블
-- 참여자 실시간 업데이트를 위해 Realtime publication에 추가
-- -----------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE event_participants;
