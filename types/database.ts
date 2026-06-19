export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  is_active: boolean;
};

export type ProductImage = {
  id: string | number;
  product_id: string | number;
  image_url: string;
  display_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock_quantity: number;
};

export type Product = {
  id: string;
  category_id: string;
  subcategory_id?: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
  subcategory?: Subcategory;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type Banner = {
  id: string | number;
  title: string;
  image_url: string;
  link_url?: string | null;
  is_active: boolean;
};

export type DashboardStats = {
  products: number;
  categories: number;
  subcategories: number;
  variants: number;
  banners: number;
};
