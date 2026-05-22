'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/templates', label: 'Form Templates', icon: '📋' },
  { href: '/admin/submissions', label: 'Submissions', icon: '📥' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy flex flex-col min-h-screen fixed top-0 left-0 bottom-0 z-10">
        <div className="p-6 border-b border-navy-600">
          <h1 className="text-gold font-bold text-lg">MacKay CEO Forums</h1>
          <p className="text-blue-300 text-xs mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-white/10 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-navy-600">
          <button
            onClick={handleLogout}
            className="w-full text-blue-300 hover:text-white text-sm py-2 px-4 rounded-lg hover:bg-white/10 transition-colors text-left"
          >
            ← Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 overflow-auto min-h-screen">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
