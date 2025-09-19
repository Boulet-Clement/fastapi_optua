import Keyword from "./Keyword";

export default interface Organization {
  organization_id: string
  lang: string
  name: string
  description: string
  keywords: string[]
  keywords_details: Keyword[]
  slug: string
  owner_id: string

  is_visible: boolean
  languages?: string[]
  opening_hours?: { day: string; open: string; close: string }[]
}
