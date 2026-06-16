import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["draft", "active", "archived"]),
  category_id: z.string().uuid().or(z.string().min(1)),
  subcategory_id: z.string().optional(),
  is_featured: z.boolean().default(false)
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10)
});
