import { Instagram, Mail, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
const contactItems: [LucideIcon, string, string][] = [
  [MessageCircle, "WhatsApp", "+91 73069 14948"],
  [Mail, "Email", "info@kuppaaya.online"],
  [Instagram, "Instagram", "@kuppaaya_"],
];

  return (
    <main>
      <section className="bg-[#f8fafc] py-20">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Contact</p>
          <h1 className="mt-4 text-5xl text-[#21183d] md:text-6xl">We're Here To Help.</h1>
          <p className="mt-5 max-w-2xl leading-8 text-[#6b6680]">Have a question about our collections, sizing, availability, or placing an order? We'd love to hear from you.</p>
        </div>
      </section>
      <section className="container-shell grid gap-8 py-16 lg:grid-cols-[1fr_0.8fr]">
        <form className="glass rounded-[8px] p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Name" className="focus-ring min-h-12 rounded-[8px] border border-[#4b328b]/10 px-4" />
            <input required type="email" placeholder="Email" className="focus-ring min-h-12 rounded-[8px] border border-[#4b328b]/10 px-4" />
          </div>
          <input placeholder="Subject" className="focus-ring mt-4 min-h-12 w-full rounded-[8px] border border-[#4b328b]/10 px-4" />
          <textarea required placeholder="Message" rows={6} className="focus-ring mt-4 w-full rounded-[8px] border border-[#4b328b]/10 p-4" />
          <Button className="mt-5" type="submit">Send Message</Button>
        </form>
        <div className="grid gap-4">
          {contactItems.map(([Icon, title, value]) => (
            <div key={title} className="rounded-[8px] border border-[#4b328b]/10 bg-white p-5 shadow-lg shadow-[#4b328b]/6">
              <div className="flex items-center gap-3">
                <span className="brand-gradient rounded-full p-3 text-white"><Icon size={20} /></span>
                <div>
                  <h2 className="font-semibold text-[#21183d]">{title}</h2>
                  <p className="text-sm text-[#6b6680]">{value}</p>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
