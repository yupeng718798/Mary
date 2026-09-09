import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:px-8"
      style={{
        background: 'linear-gradient(180deg, #eef2ff 0%, hsl(var(--background)) 40%)',
      }}
    >
      {/* Brand Hero */}
      <section className="flex flex-col items-center pb-10">
        <div className="mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-border shadow-md sm:h-32 sm:w-32">
          <img
            src="/downloaded-image.jpeg"
            alt="Mary AI Healthcare Assistant"
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-[clamp(32px,6vw,44px)] font-semibold tracking-tight text-foreground">
          Mary
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Smart Health Assistant</p>
      </section>

      {/* Enter Button */}
      <button
        onClick={() => navigate('/chat')}
        className="btn-primary mt-4 h-14 w-56 gap-2 text-base active:scale-[0.98] transition-transform duration-150"
      >
        <span>Enter</span>
        <ArrowRight className="h-5 w-5" />
      </button>

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
