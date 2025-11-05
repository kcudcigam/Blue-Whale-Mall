import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 设置最小显示时间，避免一闪而过
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <div className="text-center">
        {/* 蓝鲸图标动画 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* 主圆圈 */}
            <div className="h-24 w-24 rounded-full border-4 border-purple-200 border-t-white animate-spin"></div>
            {/* 内部蓝鲸符号 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="h-12 w-12 text-white animate-pulse" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 加载文字 */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          小蓝鲸商城
        </h2>
        <p className="text-purple-100 text-sm">
          正在加载，请稍候...
        </p>

        {/* 加载点动画 */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
