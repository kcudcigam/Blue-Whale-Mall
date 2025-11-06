import { ShoppingBag, User, LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

type Page = 'home' | 'login' | 'product-detail' | 'publish' | 'profile' | 'admin';

interface NavbarProps {
  isLoggedIn: boolean;
  userRole: 'user' | 'admin';
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Navbar({ isLoggedIn, userRole, currentPage, onNavigate, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
          >
            <ShoppingBag className="w-7 h-7 text-white" />
            <span className="text-white font-semibold text-lg">小蓝鲸商城</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                currentPage === 'home' 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              首页
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate('publish')}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    currentPage === 'publish' 
                      ? 'bg-white/20 text-white font-medium' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  发布
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    currentPage === 'profile' 
                      ? 'bg-white/20 text-white font-medium' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4" />
                  我的
                </button>
                {userRole === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                      currentPage === 'admin' 
                        ? 'bg-white/20 text-white font-medium' 
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    管理
                  </button>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Button 
                variant="ghost" 
                onClick={onLogout} 
                className="text-white hover:bg-white/10 border border-white/30"
              >
                退出
              </Button>
            ) : (
              <Button 
                onClick={() => onNavigate('login')} 
                className="bg-white text-purple-700 hover:bg-purple-50 font-medium"
              >
                登录
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2.5 rounded-lg ${
                  currentPage === 'home' ? 'bg-white/20 text-white font-medium' : 'text-white/80'
                }`}
              >
                首页
              </button>
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => {
                      onNavigate('publish');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                      currentPage === 'publish' ? 'bg-white/20 text-white font-medium' : 'text-white/80'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    发布商品
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                      currentPage === 'profile' ? 'bg-white/20 text-white font-medium' : 'text-white/80'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    个人中心
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                        currentPage === 'admin' ? 'bg-white/20 text-white font-medium' : 'text-white/80'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      后台管理
                    </button>
                  )}
                </>
              )}
              <div className="border-t border-white/20 pt-3 mt-2">
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-white hover:bg-white/10 border border-white/30"
                  >
                    退出登录
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-white text-purple-700 hover:bg-purple-50"
                  >
                    登录/注册
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
