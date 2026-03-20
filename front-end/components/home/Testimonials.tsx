"use client";

import Image from "next/image";

const testimonials = [
    {
        name: "Adam Shinee",
        role: "Actress | Events",
        quote: "James Cameron has shared photos from the set of the highly-anticipated Avatar sequel, which will be a love letter to the sea.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop"
    },
    {
        name: "Marvin Mclunney",
        role: "Actress | Series",
        quote: "James Cameron has shared photos from the set of the highly-anticipated Avatar sequel, which will be a love letter to the sea.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
    }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0f1014]">
      <div className="max-w-5xl mx-auto px-8 lg:px-16 grid md:grid-cols-2 gap-12">
        {testimonials.map((t, i) => (
            <div key={i} className="flex gap-6 items-start animate-in fade-in duration-700" style={{ animationDelay: `${i * 200}ms` }}>
                <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-white/10 shadow-xl">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div className="space-y-2 pt-2">
                    <h3 className="text-white font-black text-lg italic tracking-tight">{t.name}</h3>
                    <p className="text-[#e50914] text-xs font-bold uppercase tracking-widest">{t.role}</p>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                        {t.quote}
                    </p>
                    <button className="text-white text-[10px] font-black uppercase tracking-widest hover:text-[#e50914] transition-colors mt-2">View</button>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
}
