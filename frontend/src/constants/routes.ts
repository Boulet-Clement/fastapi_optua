export const ROUTES = {
  home: (locale: string) => `/${locale}`,
  login: (locale: string) => `/${locale}/login`,
  register: (locale: string) => `/${locale}/register`,

  search: (locale: string) => `/${locale}/search?lang=${locale}`,
  filters: (locale: string) => `/${locale}/filters?lang=${locale}`,
  
  profile: (locale: string) => `/${locale}/profile`,
};
