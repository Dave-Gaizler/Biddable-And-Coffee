export function TickerBar({ items }: { items: string[] }) {
  return (
    <div className="glass relative overflow-hidden rounded-full border-cyan-300/20 py-2">
      <div className="animate-ticker whitespace-nowrap pr-10 text-sm text-cyan-100/90">
        {items.map((item, idx) => (
          <span key={idx} className="mx-8 inline-flex items-center">✦ {item}</span>
        ))}
      </div>
    </div>
  );
}
