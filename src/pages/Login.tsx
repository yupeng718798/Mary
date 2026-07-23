import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start px-6 py-10 sm:px-8"
      style={{
        background: 'linear-gradient(180deg, #eef2ff 0%, hsl(var(--background)) 40%)',
      }}
    >
      {/* Brand Hero */}
      <section className="flex flex-col items-center pt-8 pb-6 sm:pt-12 sm:pb-8">
        <div className="mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-border shadow-sm sm:h-28 sm:w-28">
          <img
            src="/downloaded-image.jpeg"
            alt="Mary AI Healthcare Assistant"
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-[clamp(28px,5vw,36px)] font-semibold tracking-tight text-foreground">
          Mary
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">智能健康助手</p>
      </section>

      {/* Login Form */}
      <section className="w-full max-w-sm">
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="input h-12 pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-muted-foreground">
                密码
              </label>
              <a href="#" className="text-xs text-primary whitespace-nowrap">
                忘记密码?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="请输入密码"
                className="input h-12 pl-10 pr-11"
              />
              <button
                type="button"
                aria-label="显示密码"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Login CTA */}
          <button
            type="submit"
            className="btn-primary mt-2 h-12 w-full active:scale-[0.98] transition-transform duration-150"
          >
            登录
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          还没有账号？
          <a href="#" className="font-semibold text-primary whitespace-nowrap ml-1">
            立即注册
          </a>
        </p>
      </section>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom branding */}
      <footer className="pb-6 pt-8 text-center">
        <p className="text-xs text-neutral-400">
          Mary Healthcare AI &copy; 2025
        </p>
      </footer>
    </main>
  );
}
