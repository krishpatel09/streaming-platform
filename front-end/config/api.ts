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
    GET_CONTENT: "/api/admin/content",
    GET_CONTENT_BY_ID: "/api/admin/content",
    UPDATE_CONTENT: "/api/admin/content",
    DELETE_CONTENT: "/api/admin/content",
  },
  STREAMING: {
    GET_UPLOAD_URL: "/api/streaming/upload-url",
  },
  CATALOG: {
    GET_CONTENT: "/api/catalog/content",
    GET_CONTENT_BY_ID: "/api/catalog/content",
    SEARCH: "/api/catalog/search",
  },
};
