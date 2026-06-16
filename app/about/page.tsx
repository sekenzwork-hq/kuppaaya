import Image from "next/image";

const values = [
  "Quality First",
  "Customer Happiness",
  "Timeless Style",
  "Comfort Everyday"
];
export default function AboutPage() {
  return (
    <main>
      <section className="bg-[#f8fafc] py-20">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5faedb]">About Kuppaaya</p>
            <h1 className="mt-4 text-5xl leading-tight text-[#21183d] md:text-6xl">  Fashion Designed for Confidence, Comfort, and Everyday Elegance.</h1>
            <p className="mt-6 leading-8 text-[#6b6680]">  Kuppaaya is a women's fashion brand dedicated to bringing together timeless style, comfort, and quality. Our collections are thoughtfully curated for women who want to feel confident, comfortable, and effortlessly stylish in every moment.</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] shadow-2xl shadow-[#4b328b]/15">
          <Image
              src="/images/logo1.png"
              alt="About Kuppaaya"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 48vw, 100vw"
            />
          </div>
        </div>
      </section>
      <section className="container-shell grid gap-6 py-20 md:grid-cols-3">
        {[
          ["Vision", "To become a trusted premium modest fashion label known for elegant silhouettes and meaningful detail."],
          ["Mission", "To make elevated, comfortable clothing easy to discover, style, and order through a personal digital experience."],
          ["Founder Message","Kuppaaya was created from a passion for fashion and a desire to bring elegant, wearable styles to women who value both beauty and comfort."]
        ].map(([title, body]) => (
          <article key={title} className="glass rounded-[16px] p-8 hover:-translate-y-1 transition duration-300">
            <h2 className="text-3xl text-[#21183d]">{title}</h2>
            <p className="mt-4 leading-7 text-[#6b6680]">{body}</p>
          </article>
        ))}
      </section>
      <section className="bg-white pb-20">
        <div className="container-shell">
          <h2 className="text-4xl text-[#21183d]">Values</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="rounded-[8px] border border-[#4b328b]/10 bg-[#f8fafc] p-6 font-semibold text-[#4b328b]">{value}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
