import Link from "next/link";
import { Check } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0f1014] pt-24 pb-12 px-8 lg:px-16 text-zinc-500 font-medium border-t border-zinc-900">
      <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-zinc-800/50 pb-16">
        <div className="flex flex-col gap-8 w-full lg:w-1/4">
            <Link href="/" className="flex items-center gap-1 group">
                <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                MOVI<span className="text-[#e50914] not-italic">X</span>.
                </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
                Next-generation streaming platform for high-quality entertainment. Watch your favorite movies and shows anywhere, anytime.
            </p>
            <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#e50914] hover:border-[#e50914] transition-all cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 w-full lg:w-3/4">
          <div className="space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <Link href="#" className="block hover:text-white transition-colors text-sm">Our services</Link>
            <Link href="#" className="block hover:text-white transition-colors text-sm">About</Link>
            <Link href="#" className="block hover:text-white transition-colors text-sm">Join us</Link>
            <Link href="#" className="block hover:text-white transition-colors text-sm">Contact</Link>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">View Website in</h4>
            <div className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors cursor-pointer">
              <Check className="w-4 h-4 text-white" />
              <span>English</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg mb-2">Need Help?</h4>
            <Link href="#" className="block hover:text-white transition-colors">Visit Help Center</Link>
            <Link href="#" className="block hover:text-white transition-colors">Share Feedback</Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:w-1/4">
          <h4 className="text-white font-bold text-lg mb-0 text-left lg:text-right">Connect with Us</h4>
          <div className="flex lg:justify-end gap-6">
            <Link href="#" className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center justify-center transition-colors">
              <span className="font-bold text-xl text-white">f</span>
            </Link>
            <Link href="#" className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded flex items-center justify-center transition-colors text-white font-bold text-lg">
              X
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4 text-sm">
        <div className="text-zinc-500">
          <p>© 2026 STAR. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2">
            <Link href="#" className="hover:text-white">Terms Of Use</Link>
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">FAQ</Link>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="h-12 w-[140px] bg-black border border-zinc-800 rounded-md flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
             <span className="text-white font-bold text-sm tracking-tighter">GET IT ON Google Play</span>
          </div>
          <div className="h-12 w-[140px] bg-black border border-zinc-800 rounded-md flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
            <span className="text-white font-bold text-[13px] tracking-tight">Download on the App Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
