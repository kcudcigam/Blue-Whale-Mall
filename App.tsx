import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ProductPublishPage } from './components/ProductPublishPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { Navbar } from './components/Navbar';

type Page = 'home' | 'login' | 'product-detail' | 'publish' | 'profile' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const handleLogin = (role: 'user' | 'admin' = 'user') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
  };

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
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage onProductClick={handleProductClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      {currentPage !== 'login' && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      <main className={currentPage !== 'login' ? 'pt-16' : ''}>
        {renderPage()}
      </main>
    </div>
  );
}
