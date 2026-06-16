import fs from "fs";
import path from "path";
import { products as initialProducts, categories as initialCategories, banners as initialBanners } from "@/lib/sample-data";

const DB_FILE = path.join(process.cwd(), "lib", "local-db.json");

export interface LocalDb {
  products: any[];
  categories: any[];
  subcategories: any[];
  product_variants: any[];
  banners: any[];
  product_images: any[];
  settings: any[];
}

function initDb(): LocalDb {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data);
      // Ensure all fields exist
      if (
        db.products &&
        db.categories &&
        db.subcategories &&
        db.product_variants &&
        db.banners &&
        db.product_images &&
        db.settings
      ) {
        return db;
      }
      // If settings is missing, add it to existing db
      if (db.products && !db.settings) {
        db.settings = [
          {
            id: "default",
            whatsapp_number: "919999999999",
            contact_email: "info@kuppaaya.com",
            instagram_url: "https://instagram.com/kuppaaya",
            facebook_url: "https://facebook.com/kuppaaya",
            footer_text: "© 2026 Kuppaaya. Premium women's fashion.",
            brand_description: "Premium women's fashion designed for confidence, comfort, and everyday elegance.",
            seo_title: "Kuppaaya | Premium Women's Fashion",
            seo_description: "Premium women's clothing, contemporary dresses, ethnic wear, and festive collections designed for confidence and everyday elegance.",
            created_at: new Date().toISOString()
          }
        ];
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
        return db;
      }
    } catch (e) {
      console.error("Error reading local db, reinitializing", e);
    }
  }

  // Build initial tables
  const products: any[] = [];
  const product_variants: any[] = [];
  const product_images: any[] = [];

  initialProducts.forEach((p) => {
    const { product_images: imgs, product_variants: varts, ...rest } = p as any;
    products.push({
      ...rest,
      created_at: new Date().toISOString()
    });

    if (imgs && Array.isArray(imgs)) {
      imgs.forEach((img) => product_images.push(img));
    } else {
      product_images.push({
        id: `img-${p.id}`,
        product_id: p.id,
        image_url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=82",
        sort_order: 0
      });
    }

    if (varts && Array.isArray(varts)) {
      varts.forEach((v) => product_variants.push(v));
    }
  });

  const db: LocalDb = {
    products,
    categories: initialCategories.map(c => ({ ...c, created_at: new Date().toISOString() })),
    subcategories: [
      { id: "sub-1", name: "Midi Dresses", slug: "midi-dresses", category_id: "dresses", is_active: true, created_at: new Date().toISOString() }
    ],
    product_variants,
    banners: initialBanners.map(b => ({ ...b, created_at: new Date().toISOString() })),
    product_images,
    settings: [
      {
        id: "default",
        whatsapp_number: "919999999999",
        contact_email: "info@kuppaaya.com",
        instagram_url: "https://instagram.com/kuppaaya",
        facebook_url: "https://facebook.com/kuppaaya",
        footer_text: "© 2026 Kuppaaya. Premium women's fashion.",
        brand_description: "Premium women's fashion designed for confidence, comfort, and everyday elegance.",
        seo_title: "Kuppaaya | Premium Women's Fashion",
        seo_description: "Premium women's clothing, contemporary dresses, ethnic wear, and festive collections designed for confidence and everyday elegance.",
        created_at: new Date().toISOString()
      }
    ]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  return db;
}

export function getLocalDb(): LocalDb {
  return initDb();
}

export function saveLocalDb(db: LocalDb) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}
