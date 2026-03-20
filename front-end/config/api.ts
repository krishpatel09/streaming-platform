export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: "/api/v1/auth/send-otp",
    VERIFY_OTP: "/api/v1/auth/verify-otp",
    REFRESH_TOKEN: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
    GET_SESSIONS: "/api/v1/auth/sessions",
    REVOKE_SESSION: "/api/v1/auth/sessions/:id",
  },
  USER: {
    PROFILES: "/api/v1/profiles",
    UPDATE_USER: "/api/v1/user/update",
  },
};
