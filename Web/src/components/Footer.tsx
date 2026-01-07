import {
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 border-t border-indigo-500/20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Slim Layout: Reduced padding to p-5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/5 border-b border-white/5">
          {/* Box 1: Brand - Compact */}
          <div className="md:col-span-4 p-5 flex flex-col justify-center h-full relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-cyan-400">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="text-lg font-bold text-white tracking-tight block">
                    SmartClinic
                  </span>
                  <span className="text-[9px] text-indigo-400 uppercase tracking-widest font-semibold">
                    AI System
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                Secured & HIPAA Compliant Platform.
              </p>
            </div>
          </div>

          {/* Box 2: Navigation - Compact & Tight */}
          <div className="md:col-span-5 p-5 bg-slate-900/20 flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-y-2 gap-x-4">
              {[
                "Dashboard",
                "Patients",
                "Appointments",
                "Analytics",
                "Settings",
                "Support",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-2 group transition-all"
                >
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Box 3: Action - Help Center Button */}
          <div className="md:col-span-3 p-5 flex items-center justify-end bg-gradient-to-b from-indigo-950/30 to-slate-950/50">
            <a
              href="#"
              className="w-full flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all group hover:border-cyan-500/30"
            >
              {/* שיניתי את הטקסט כאן ל-Help Center */}
              <span className="text-xs font-medium">Help Center</span>
              <ArrowRight
                size={14}
                className="text-cyan-400 group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar - Extra Thin */}
        <div className="px-5 py-3 flex justify-between items-center text-[10px] text-slate-600 bg-slate-950">
          <p>© {currentYear} SmartClinic AI.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Facebook size={12} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Twitter size={12} />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Linkedin size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
