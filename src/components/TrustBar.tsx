export default function TrustBar() {
  const items = [
    { icon: "🌿", text: "طبيعي 100%" },
    { icon: "🚚", text: "توصيل مجاني" },
    { icon: "💳", text: "دفع عند الاستلام" },
    { icon: "🔄", text: "ضمان 30 يوم" },
    { icon: "✨", text: "جودة مضمونة" },
  ];

  return (
    <div
      className="w-full overflow-x-auto py-3"
      style={{ background: "var(--brand-green)" }}
    >
      <div className="flex items-center justify-center gap-6 min-w-max px-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap">
            <span>{item.icon}</span>
            <span className="opacity-90">{item.text}</span>
            {i < items.length - 1 && (
              <span className="opacity-30 mr-2">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
