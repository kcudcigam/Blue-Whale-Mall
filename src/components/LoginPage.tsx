import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (role?: 'user' | 'admin') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(loginEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    if (!validatePassword(loginPassword)) {
      toast.error('密码至少需要6个字符');
      return;
    }

    // Demo: admin@example.com logs in as admin
    const role = loginEmail === 'admin@example.com' ? 'admin' : 'user';
    toast.success('登录成功！');
    onLogin(role);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(registerEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    
    if (!validatePhone(registerPhone)) {
      toast.error('请输入有效的手机号码');
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

    toast.success('注册成功！');
    onLogin('user');
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

    toast.success('登录成功！');
    onLogin('user');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white p-4">
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
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1.5"
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

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    登录
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

                  <p className="text-gray-500 text-center">
                    测试账号: admin@example.com (管理员)
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-email">邮箱地址</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="请输入邮箱"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-phone">手机号码</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="请输入11位手机号"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="mt-1.5"
                      maxLength={11}
                      required
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
                      required
                    />
                    <p className="text-gray-500 mt-1">
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
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    注册
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
