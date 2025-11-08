import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BookMarked, Calendar, LogOut, MessageSquare, Package, PanelLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/app/dashboard', icon: Calendar, label: 'Dashboard' },
  { to: '/app/entries', icon: BookMarked, label: 'Entries' },
  { to: '/app/products', icon: Package, label: 'Products' },
  { to: '/app/chat', icon: MessageSquare, label: 'Group Chat' },
];

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setUserName(data.full_name);
          }
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className={`font-bold text-primary ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>SVS MESS</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <PanelLeft className="w-6 h-6" />
          </Button>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors ${isActive ? 'bg-gray-100 text-primary' : ''}`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className={`ml-4 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <div>
            {/* Can add breadcrumbs or page title here */}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Welcome, {userName}!</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
