export const ROUTES = {
  home: (locale: string) => `/${locale}`,
  login: (locale: string) => `/${locale}/login`,
  register: (locale: string) => `/${locale}/register`,

  search: (locale: string) => `/${locale}/search?lang=${locale}`,
  filters: (locale: string) => `/${locale}/filters?lang=${locale}`,
  
  dashboard: (locale: string) => `/${locale}/dashboard`,
  dashboard_organizations: (locale: string) => `/${locale}/dashboard/organizations`,
  dashboard_billing: (locale: string) => `/${locale}/dashboard/billing`,
  dashboard_settings: (locale: string) => `/${locale}/dashboard/settings`,
};
