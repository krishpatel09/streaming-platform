export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SEARCH: "/search",
  MY_LIST: "/my-list",
  MOVIES: "/movies",
  SERIES: "/series",
  LIVE_TV: "/live-tv",
  PROFILE: "/profile",
  PROFILES: "/profiles/manage",
  PLANS: "/plans",
  SETTINGS: "/settings",
  HELP: "/help",
  ABOUT: "/about",
  SUBSCRIBE: "/subscribe",
};

export const AUTH_ROUTES = [ROUTES.LOGIN];

export const PROTECTED_ROUTES = [
  ROUTES.MY_LIST,
  ROUTES.PROFILE,
  ROUTES.PROFILES,
  ROUTES.SETTINGS,
];
