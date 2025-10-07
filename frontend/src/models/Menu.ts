export default interface Menu {
  title?: string;
  categories?: {
    name: string;
    notes?: string;
    items?: {
      name: string;
      ingredients?: string;
      price?: number;
      available?: boolean;
    }[];
  }[];
}
