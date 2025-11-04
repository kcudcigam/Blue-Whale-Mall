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
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
          >
            <ShoppingBag className="w-8 h-8 text-purple-600" />
            <span className="text-purple-900">小蓝鲸商城</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`text-gray-700 hover:text-purple-600 transition-colors ${
                currentPage === 'home' ? 'text-purple-600' : ''
              }`}
            >
              首页
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate('publish')}
                  className={`text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-1 ${
                    currentPage === 'publish' ? 'text-purple-600' : ''
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  发布商品
                </button>
                <button
                  onClick={() => onNavigate('profile')}
                  className={`text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-1 ${
                    currentPage === 'profile' ? 'text-purple-600' : ''
                  }`}
                >
                  <User className="w-4 h-4" />
                  个人中心
                </button>
                {userRole === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-1 ${
                      currentPage === 'admin' ? 'text-purple-600' : ''
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    后台管理
                  </button>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Button variant="outline" onClick={onLogout} className="border-purple-300 text-purple-700 hover:bg-purple-50">
                退出登录
              </Button>
            ) : (
              <Button onClick={() => onNavigate('login')} className="bg-purple-600 hover:bg-purple-700 text-white">
                登录/注册
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-2 rounded-lg ${
                  currentPage === 'home' ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
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
                    className={`text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                      currentPage === 'publish' ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
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
                    className={`text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                      currentPage === 'profile' ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
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
                      className={`text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                        currentPage === 'admin' ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      后台管理
                    </button>
                  )}
                </>
              )}
              <div className="border-t border-gray-200 pt-3 mt-2">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full border-purple-300 text-purple-700"
                  >
                    退出登录
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
