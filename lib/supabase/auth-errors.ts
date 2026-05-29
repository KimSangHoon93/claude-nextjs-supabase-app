const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다",
  "Email not confirmed":
    "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요",
  "User already registered": "이미 가입된 이메일 주소입니다",
  "Password should be at least 6 characters":
    "비밀번호는 최소 6자 이상이어야 합니다",
  "Unable to validate email address: invalid format":
    "올바른 이메일 형식이 아닙니다",
  "Email rate limit exceeded":
    "이메일 전송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요",
  over_email_send_rate_limit:
    "이메일 전송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요",
  "Too many requests": "요청이 너무 많습니다. 잠시 후 다시 시도해주세요",
};

export function translateAuthError(message: string): string {
  return AUTH_ERROR_MAP[message] ?? message ?? "오류가 발생했습니다";
}
