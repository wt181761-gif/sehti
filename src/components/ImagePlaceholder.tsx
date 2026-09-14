import React from 'react';

export default function ImagePlaceholder({ text = "صورة المنتج قريباً", productName = "", emoji = "📸", bgColor = "var(--brand-cream)", color = "var(--brand-green)" }) {
  return (
    <div 
      className="w-full h-full min-h-[350px] md:min-h-[450px] rounded-3xl flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: color, transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5" style={{ background: color, transform: 'translate(-20%, 20%)' }} />
      
      <div className="text-6xl md:text-8xl mb-6 relative z-10">{emoji}</div>
      <div className="font-bold text-xl md:text-2xl mb-3 relative z-10" style={{ color: color }}>
        {productName}
      </div>
      <div className="text-sm font-medium px-4 py-2 rounded-full relative z-10" style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--brand-muted)' }}>
        {text}
      </div>
    </div>
  );
}