export default function TrustBar() {
  const items = [
    { icon: "🌿", text: "طبيعي 100%" },
    { icon: "🚚", text: "توصيل مجاني" },
    { icon: "💳", text: "دفع عند الاستلام" },
    { icon: "🔄", text: "ضمان 30 يوم" },
    { icon: "⭐", text: "+500 زبون راضي" },
  ];

  return (
    <div className="w-full overflow-x-auto py-2.5" style={{ background: "var(--brand-gold)" }}>
      <div className="flex items-center justify-center gap-1 min-w-max px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-5">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-bold" style={{ color: "var(--brand-green)" }}>{item.text}</span>
            </div>
            {i < items.length - 1 && (
              <span className="text-xs opacity-40 font-light" style={{ color: "var(--brand-green)" }}>✦</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
