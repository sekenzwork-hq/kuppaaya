import type { Banner, Category, Product } from "@/types/database";

export const categories: Category[] = [
  {
    id: "dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Elegant dresses designed for movement and ease.",
    image_url: "/assets/11.jpeg",
    is_active: true
  },
  {
    id: "casual-wear",
    name: "Casual Wear",
    slug: "casual-wear",
    description: "Effortless everyday styles and co-ords for pure comfort.",
    image_url: "/assets/4.jpeg",
    is_active: true
  },
  {
    id: "ethnic-wear",
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    description: "Timeless silhouettes honoring heritage and graceful aesthetics.",
    image_url: "/assets/2.jpeg",
    is_active: true
  },
  {
    id: "festive",
    name: "Festive Collection",
    slug: "festive-collection",
    description: "Polished statement pieces designed for celebration.",
    image_url: "/assets/7.jpeg",
    is_active: true
  }
];

export const products: Product[] = [
  {
    id: "1",
    category_id: "dresses",
    name: "Ruffled Cream Floral Dress",
    slug: "ruffled-cream-floral-dress",
    description: "A gorgeous cream and pastel floral-print midi dress featuring double-layered ruffles around a square neck and comfortable puff sleeves.",
    price: 4200,
    compare_at_price: 4800,
    stock: 25,
    status: "active",
    is_featured: true,
    is_new: true,
    is_best_seller: false,
    product_images: [{ id: "1a", product_id: "1", image_url: "/assets/11.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v1", product_id: "1", size: "S", color: "Cream", stock_quantity: 10 },
      { id: "v2", product_id: "1", size: "M", color: "Cream", stock_quantity: 15 }
    ]
  },
  {
    id: "2",
    category_id: "casual-wear",
    name: "Waffle Knit Skirt Set",
    slug: "waffle-knit-skirt-set",
    description: "A premium blue-teal waffle-textured casual set featuring a collared crop shirt and a matching flared midi skirt.",
    price: 3200,
    compare_at_price: 3600,
    stock: 15,
    status: "active",
    is_featured: true,
    is_new: false,
    is_best_seller: true,
    product_images: [{ id: "2a", product_id: "2", image_url: "/assets/1.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v3", product_id: "2", size: "S", color: "Teal", stock_quantity: 5 },
      { id: "v4", product_id: "2", size: "M", color: "Teal", stock_quantity: 10 }
    ]
  },
  {
    id: "3",
    category_id: "ethnic-wear",
    name: "Blue Indigo Printed Kurti",
    slug: "blue-indigo-printed-kurti",
    description: "Sleeveless indigo blue block-printed A-line kurti with detailed front borders and traditional ethnic styling.",
    price: 2200,
    stock: 24,
    status: "active",
    is_featured: true,
    is_new: false,
    is_best_seller: false,
    product_images: [{ id: "3a", product_id: "3", image_url: "/assets/2.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v5", product_id: "3", size: "M", color: "Blue", stock_quantity: 12 },
      { id: "v6", product_id: "3", size: "L", color: "Blue", stock_quantity: 12 }
    ]
  },
  {
    id: "4",
    category_id: "dresses",
    name: "Puff Sleeve Paisley Dress",
    slug: "puff-sleeve-paisley-dress",
    description: "A vintage-inspired white midi dress with romantic puff sleeves, an elegant square neck, and a grey paisley motif.",
    price: 4100,
    compare_at_price: 4500,
    stock: 18,
    status: "active",
    is_featured: true,
    is_new: true,
    is_best_seller: true,
    product_images: [{ id: "4a", product_id: "4", image_url: "/assets/3.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v7", product_id: "4", size: "S", color: "White", stock_quantity: 8 },
      { id: "v8", product_id: "4", size: "M", color: "White", stock_quantity: 10 }
    ]
  },
  {
    id: "5",
    category_id: "casual-wear",
    name: "Geometric Casual Co-ord",
    slug: "geometric-casual-co-ord",
    description: "A modern, trendy co-ord set with detailed geometric print, wide-leg trouser pants, and a short-sleeve collared shirt.",
    price: 3500,
    stock: 20,
    status: "active",
    is_featured: true,
    is_new: true,
    is_best_seller: false,
    product_images: [
      { id: "5a", product_id: "5", image_url: "/assets/4.jpeg", sort_order: 0 },
      { id: "5b", product_id: "5", image_url: "/assets/4.1.jpeg", sort_order: 1 }
    ],
    product_variants: [
      { id: "v9", product_id: "5", size: "S", color: "Multi", stock_quantity: 10 },
      { id: "v10", product_id: "5", size: "M", color: "Multi", stock_quantity: 10 }
    ]
  },
  {
    id: "6",
    category_id: "ethnic-wear",
    name: "Lime Green Block-Print Set",
    slug: "lime-green-block-print-set",
    description: "A premium chartreuse block-printed tunic top with asymmetrical hemline paired with striped wide-leg pants.",
    price: 3800,
    compare_at_price: 4200,
    stock: 12,
    status: "active",
    is_featured: true,
    is_new: false,
    is_best_seller: true,
    product_images: [
      { id: "6a", product_id: "6", image_url: "/assets/5.jpeg", sort_order: 0 },
      { id: "6b", product_id: "6", image_url: "/assets/5.1.jpeg", sort_order: 1 }
    ],
    product_variants: [
      { id: "v11", product_id: "6", size: "M", color: "Green", stock_quantity: 6 },
      { id: "v12", product_id: "6", size: "L", color: "Green", stock_quantity: 6 }
    ]
  },
  {
    id: "7",
    category_id: "dresses",
    name: "Floral Summer Puff Dress",
    slug: "floral-summer-puff-dress",
    description: "A beautiful blue and white floral-print dress featuring puffed shoulders, a sweetheart neckline, and a flowing tiered skirt.",
    price: 3900,
    stock: 16,
    status: "active",
    is_featured: false,
    is_new: true,
    is_best_seller: true,
    product_images: [{ id: "7a", product_id: "7", image_url: "/assets/6.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v13", product_id: "7", size: "S", color: "Blue/White", stock_quantity: 8 },
      { id: "v14", product_id: "7", size: "M", color: "Blue/White", stock_quantity: 8 }
    ]
  },
  {
    id: "8",
    category_id: "festive",
    name: "Kerala Kasavu Saree",
    slug: "kerala-kasavu-saree",
    description: "A timeless off-white Kerala Kasavu cotton saree paired with a contrasting red patterned full-sleeve blouse.",
    price: 4900,
    compare_at_price: 5500,
    stock: 10,
    status: "active",
    is_featured: true,
    is_new: false,
    is_best_seller: false,
    product_images: [{ id: "8a", product_id: "8", image_url: "/assets/7.jpeg", sort_order: 0 }],
    product_variants: [{ id: "v15", product_id: "8", size: "One Size", color: "Gold/Red", stock_quantity: 10 }]
  },
  {
    id: "9",
    category_id: "ethnic-wear",
    name: "Teal Ethnic Skirt Set",
    slug: "teal-ethnic-skirt-set",
    description: "A modern ethnic fusion skirt set comprising a fitted teal elbow-sleeve top and a flowing white tier-skirt.",
    price: 2900,
    stock: 22,
    status: "active",
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    product_images: [{ id: "9a", product_id: "9", image_url: "/assets/8.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v16", product_id: "9", size: "S", color: "Teal/White", stock_quantity: 11 },
      { id: "v17", product_id: "9", size: "M", color: "Teal/White", stock_quantity: 11 }
    ]
  },
  {
    id: "10",
    category_id: "festive",
    name: "Elegant Purple Saree Set",
    slug: "elegant-purple-saree-set",
    description: "An ivory handloom saree featuring fine yellow checks, finished with a dark purple embroidered blouse.",
    price: 5200,
    compare_at_price: 5800,
    stock: 8,
    status: "active",
    is_featured: true,
    is_new: true,
    is_best_seller: true,
    product_images: [{ id: "10a", product_id: "10", image_url: "/assets/9.jpeg", sort_order: 0 }],
    product_variants: [{ id: "v18", product_id: "10", size: "One Size", color: "Ivory/Purple", stock_quantity: 8 }]
  },
  {
    id: "11",
    category_id: "ethnic-wear",
    name: "Peacock Embroidered Kurti",
    slug: "peacock-embroidered-kurti",
    description: "An elegant off-white knee-length kurti featuring beautiful hand-printed peacock feather motifs on the bodice and sleeves.",
    price: 2750,
    stock: 14,
    status: "active",
    is_featured: false,
    is_new: false,
    is_best_seller: true,
    product_images: [{ id: "11a", product_id: "11", image_url: "/assets/10.jpeg", sort_order: 0 }],
    product_variants: [
      { id: "v19", product_id: "11", size: "S", color: "Off-White", stock_quantity: 6 },
      { id: "v20", product_id: "11", size: "M", color: "Off-White", stock_quantity: 8 }
    ]
  }
];

export const banners: Banner[] = [
  {
    id: "hero",
    title: "Fashion That Moves With You",
    subtitle: "Discover thoughtfully crafted collections designed for confidence, comfort, and effortless style.",
    image_url: "/assets/11.jpeg",
    link_url: "/shop",
    is_active: true,
    sort_order: 1
  }
];
