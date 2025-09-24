export const ROUTES = {
  home: (locale: string) => `/${locale}`,
  auth: {
    login: (locale:string) => `/${locale}/login`,
    register: (locale:string) => `/${locale}/register`
  },
  dashboard: {
    index: (locale: string) => `/${locale}/dashboard`,
    organizations: {
      index: (locale: string) => `/${locale}/dashboard/organizations`,
      details: (locale: string, slug: string) => `/${locale}/dashboard/organizations/${slug}`,
      new: (locale: string) => `/${locale}/dashboard/organizations/new`,
      new_translation: (locale: string, orgId: string) => `/${locale}/dashboard/organizations/new?orgId=${orgId}&lang=${locale}`,
      new_keyword: (locale: string, slug: string) => `/${locale}/dashboard/organizations/${slug}/keywords/add`
    },
    
    billing: (locale: string) => `/${locale}/dashboard/billing`,
    settings: (locale: string) => `/${locale}/dashboard/settings`
  },

  login: (locale: string) => `/${locale}/login`,
  register: (locale: string) => `/${locale}/register`,

  search: (locale: string) => `/${locale}/search?lang=${locale}`,
  search_with_query: (locale: string, query?: string) => `/${locale}/search?lang=${locale}&query=${query}`,
  filters: (locale: string) => `/${locale}/filters?lang=${locale}`,
  
  //dashboard: (locale: string) => `/${locale}/dashboard`,
  dashboard_organizations: (locale: string) => `/${locale}/dashboard/organizations`,
  dashboard_billing: (locale: string) => `/${locale}/dashboard/billing`,
  dashboard_settings: (locale: string) => `/${locale}/dashboard/settings`,

  roadmap: (locale: string) => `/${locale}/roadmap`,
  terms_of_use: (locale: string) => `/${locale}/terms-of-use`,
  privacy_policy: (locale: string) => `/${locale}/privacy-policy`,
  mandatory_informations: (locale: string) => `/${locale}/mandatory-informations`
};
