import { Sparkles, Lock, Mail, Loader2 } from "lucide-react";
import useLogin from "../hooks/useLogin";

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLogin();

  return (
    <div className="w-full max-w-md z-10 px-6">
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-2xl shadow-slate-200/50">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
            <Sparkles className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">
            SmartClinic AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="name@clinic.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-rose-600 text-sm bg-rose-50 border border-rose-200 p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
