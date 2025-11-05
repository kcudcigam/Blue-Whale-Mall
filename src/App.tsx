import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ProductPublishPage } from './components/ProductPublishPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';
import { LoadingScreen } from './components/LoadingScreen';
import { clearToken } from './services/api';

type Page = 'home' | 'login' | 'product-detail' | 'publish' | 'profile' | 'admin';

interface UserData {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  token: string;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // 模拟应用初始化
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (data: UserData) => {
    setIsLoggedIn(true);
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    clearToken();
    localStorage.removeItem('userData');
    setCurrentPage('home');
  };

  // 检查本地存储的登录状态
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const data = JSON.parse(savedUserData);
        setIsLoggedIn(true);
        setUserData(data);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'product-detail':
        return <ProductDetailPage productId={selectedProductId} onBack={() => setCurrentPage('home')} />;
      case 'publish':
        return <ProductPublishPage onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} userData={userData} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage onProductClick={handleProductClick} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'login' && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userData?.role || 'user'}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      <main className={currentPage !== 'login' ? 'pt-14' : ''}>
        {renderPage()}
      </main>
    </div>
  );
}
