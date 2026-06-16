"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MessageCircle, Share2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";

export function ProductDetail({ product }: { product: Product }) {
  const images = product.product_images?.length ? product.product_images : [{ id: "logo", product_id: product.id, image_url: "/images/logo.png", sort_order: 0 }];
  const [activeImage, setActiveImage] = useState(images[0].image_url);
  const [variantId, setVariantId] = useState(product.product_variants?.[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);

  const variant = useMemo(
    () => product.product_variants?.find((item) => item.id === variantId) ?? product.product_variants?.[0],
    [product.product_variants, variantId]
  );

  const whatsappHref = useMemo(() => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917306914948";
    const message = [
      `Hello Kuppaaya, I would like to order: ${product.name}`,
      `Size: ${variant?.size ?? "Not selected"}`,
      `Color: ${variant?.color ?? "Not selected"}`,
      `Quantity: ${quantity}`,
      `Price: ${formatPrice(product.price)}`
    ].join("\n");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [product.name, product.price, quantity, variant]);

  return (
    <div className="container-shell grid gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-4 md:grid-cols-[92px_1fr]">
        <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(image.image_url)}
              className="focus-ring relative h-24 w-20 shrink-0 overflow-hidden rounded-[8px] border border-[#4b328b]/10 bg-white"
            >
              <Image src={image.image_url} alt={product.name} fill className="object-cover" sizes="92px" />
            </button>
          ))}
        </div>
        <div className="group relative order-1 aspect-[4/5] overflow-hidden rounded-[8px] bg-[#f8fafc] shadow-2xl shadow-[#4b328b]/12 md:order-2">
          <Image src={activeImage} alt={product.name} fill priority className="object-cover transition duration-700 group-hover:scale-110" sizes="(min-width: 1024px) 50vw, 100vw" />
          <div className="absolute right-4 top-4 rounded-full bg-white/88 p-3 text-[#4b328b] backdrop-blur">
            <ZoomIn size={20} />
          </div>
        </div>
      </div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Product Details</p>
        <h1 className="mt-4 text-5xl leading-tight text-[#21183d]">{product.name}</h1>
        <div className="mt-5 text-2xl font-semibold text-[#4b328b]">{formatPrice(product.price)}</div>
        <p className="mt-6 leading-8 text-[#6b6680]">{product.description}</p>
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4b328b]">Variant</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.product_variants?.map((item) => (
              <button
                key={item.id}
                onClick={() => setVariantId(item.id)}
                className={`focus-ring rounded-full border px-4 py-2 text-sm transition ${variantId === item.id ? "border-[#6e63b8] bg-[#6e63b8] text-white" : "border-[#4b328b]/15 bg-white text-[#4b328b]"}`}
              >
                {item.size} · {item.color}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <label className="text-sm font-semibold text-[#4b328b]" htmlFor="quantity">Quantity</label>
          <input id="quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="focus-ring h-12 w-24 rounded-full border border-[#4b328b]/15 px-4" />
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="focus-ring brand-gradient inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-lg shadow-[#6e63b8]/25">
            <MessageCircle size={19} />
            Order on WhatsApp
          </a>
          <Button variant="secondary" type="button">
            <Share2 size={18} />
            Share
          </Button>
        </div>
      </section>
    </div>
  );
}
