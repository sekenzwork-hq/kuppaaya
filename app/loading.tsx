export default function Loading() {
  return (
    <main className="container-shell grid min-h-[60vh] gap-5 py-16">
      <div className="h-10 w-64 animate-pulse rounded-full bg-[#5faedb]/20" />
      <div className="grid gap-5 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse rounded-[8px] bg-[#4b328b]/10" />
        ))}
      </div>
    </main>
  );
}
