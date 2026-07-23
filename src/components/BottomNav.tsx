import { useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, MessageCircle, User } from 'lucide-react';

const navItems = [
  { key: 'home', label: '首页', icon: Home, path: '/dashboard' },
  { key: 'records', label: '病历', icon: FileText, path: '/records' },
  { key: 'consult', label: '问诊', icon: MessageCircle, path: '/consultation' },
  { key: 'profile', label: '我的', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto grid h-14 max-w-md grid-cols-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 h-full"
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[11px] leading-none whitespace-nowrap max-w-full truncate ${
                  active ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
