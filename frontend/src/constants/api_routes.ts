const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    logout: `${BASE_URL}/auth/logout`,
  },

  dashboard: `${BASE_URL}/dashboard/`,
  languages: `${BASE_URL}/languages`,

  organizations: {
    index: `${BASE_URL}/organizations`,
    mine: (locale: string) =>  `${BASE_URL}/organizations/mine?lang=${locale}`
  },

  user: {
    profile: `${BASE_URL}/user/profile`,
    settings: `${BASE_URL}/user/settings`,
  },
};
