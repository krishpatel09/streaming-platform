export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: "/api/auth/send-otp",
    VERIFY_OTP: "/api/auth/verify-otp",
    REFRESH_TOKEN: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    GET_SESSIONS: "/api/auth/sessions",
    REVOKE_SESSION: "/api/auth/sessions/:id",
  },
  USER: {
    PROFILES: "/api/profiles",
    UPDATE_USER: "/api/user/update",
  },
  ADMIN: {
    ADD_CONTENT: "/api/admin/content",
    NOTIFY_UPLOAD: "/api/admin/upload",
  },
  STREAMING: {
    GET_UPLOAD_URL: "/api/streaming/upload-url",
  },
};
