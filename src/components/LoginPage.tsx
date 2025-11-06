import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";
import { login, register, setToken } from '../services/api';

interface LoginPageProps {
  onLogin: (userData: { userId: string; username: string; role: 'user' | 'admin'; token: string }) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUsername.trim()) {
      toast.error('请输入用户名或邮箱');
      return;
    }
    
    if (!validatePassword(loginPassword)) {
      toast.error('密码至少需要6个字符');
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await login({
        username: loginUsername,
        password: loginPassword
      });

      if (response.success && response.data) {
        setToken(response.data.token!);
        toast.success('登录成功！');
        onLogin({
          userId: response.data.userId,
          username: response.data.username,
          role: response.data.role,
          token: response.data.token!
        });
      }
    } catch (error: any) {
      toast.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerUsername.trim()) {
      toast.error('请输入用户名');
      return;
    }
    
    if (registerUsername.length < 3 || registerUsername.length > 20) {
      toast.error('用户名长度必须在3-20个字符之间');
      return;
    }
    
    if (!validateEmail(registerEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    if (!validatePassword(registerPassword)) {
      toast.error('密码至少需要6个字符');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }

    setIsRegistering(true);
    try {
      const response = await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        phone: registerPhone || undefined
      });

      if (response.success && response.data) {
        setToken(response.data.token!);
        toast.success('注册成功！欢迎加入小蓝鲸商城');
        onLogin({
          userId: response.data.userId,
          username: response.data.username,
          role: response.data.role,
          token: response.data.token!
        });
      }
    } catch (error: any) {
      toast.error(error.message || '注册失败，请稍后重试');
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phoneNumber)) {
      toast.error('请输入有效的手机号码');
      return;
    }
    
    if (verificationCode.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }

    // 手机登录功能暂未实现后端
    toast.info('手机验证码登录功能开发中，请使用用户名/邮箱登录');
  };

  const sendVerificationCode = () => {
    if (!validatePhone(phoneNumber)) {
      toast.error('请输入有效的手机号码');
      return;
    }
    
    setCodeSent(true);
    toast.success('验证码已发送');
    
    // Reset after 60 seconds
    setTimeout(() => setCodeSent(false), 60000);
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-purple-50 to-white overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-purple-900 mb-2">小蓝鲸商城</h1>
          <p className="text-gray-600">欢迎来到您的在线购物平台</p>
        </div>

        <Card className="border-purple-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-purple-900">账户登录</CardTitle>
            <CardDescription>登录或创建新账户开始购物</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">用户名/邮箱</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="请输入用户名或邮箱"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="mt-1.5"
                      disabled={isLoggingIn}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">密码</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="请输入密码"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoggingIn}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="cursor-pointer">
                        记住我
                      </Label>
                    </div>
                    <button type="button" className="text-purple-600 hover:text-purple-700">
                      忘记密码？
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? '登录中...' : '登录'}
                  </Button>

                  <div className="text-center text-gray-500">或</div>

                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <p className="text-gray-700 mb-3">手机验证码登录</p>
                    <div className="space-y-3">
                      <Input
                        type="tel"
                        placeholder="请输入手机号"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="验证码"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={sendVerificationCode}
                          disabled={codeSent}
                          className="border-purple-300"
                        >
                          {codeSent ? '已发送' : '发送'}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700"
                        onClick={handlePhoneLogin}
                      >
                        手机号登录
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-500 text-center text-sm">
                    管理员账号: admin / admin123
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-username">用户名</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="请输入用户名（3-20个字符）"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className="mt-1.5"
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-email">邮箱地址</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="mt-1.5"
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-phone">手机号码（可选）</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="请输入11位手机号"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="mt-1.5"
                      maxLength={11}
                      disabled={isRegistering}
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="请输入密码（至少6位）"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="mt-1.5"
                      disabled={isRegistering}
                      required
                    />
                    <p className="text-gray-500 mt-1 text-sm">
                      密码强度：{registerPassword.length < 6 ? '弱' : registerPassword.length < 10 ? '中' : '强'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">确认密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="请再次输入密码"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="mt-1.5"
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isRegistering}
                  >
                    {isRegistering ? '注册中...' : '注册'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
