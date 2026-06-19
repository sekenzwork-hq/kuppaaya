import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#4b328b]/10 bg-white">
      <div className="hidden md:grid container-shell gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="text-left">
          <Image src="/images/logo.png" alt="Kuppaaya" width={170} height={100} className="h-16 w-auto object-contain" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#6b6680]">
            Where Passion Meets Fashion
          </p>
        </div>
        {([
          ["Shop", ["Casual Wear", "Ethnic Wear", "Dresses"]],
          ["Brand", ["About", "Contact", "Testimonials", "Instagram"]],
          ["Support", ["WhatsApp"]]
        ] as const).map(([title, links]) => (
          <div key={title} className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4b328b]">{title}</h3>
            <div className="mt-5 grid gap-3 text-sm text-[#6b6680]">
              {links.map((link) => {
                let href = "/shop";
                if (link === "About") href = "/about";
                else if (link === "Contact") href = "/contact";
                else if (link === "Instagram") href = "https://instagram.com/kuppaaya_";
                else if (link === "Casual Wear") href = "/shop?category=casual-wear";
                else if (link === "Ethnic Wear") href = "/shop?category=ethnic-wear";
                else if (link === "Dresses") href = "/shop?category=dresses";
                
                return (
                  <Link key={link} href={href} className="hover:text-[#4b328b] transition duration-200">
                    {link}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block border-t border-[#4b328b]/10 py-2 text-center text-xs text-[#6b6680]">
        © {new Date().getFullYear()} Kuppaaya. Premium women's fashion. All rights reserved.
      </div>
      <div className="block md:hidden py-4 text-center text-[10px] text-[#6b6680]">
        @2026 Kuppaaya all credits
      </div>
    </footer>
  );
}
