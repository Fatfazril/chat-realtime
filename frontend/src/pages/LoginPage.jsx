import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen w-full">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Navigation */}
        <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-20 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
            <h2 className="text-xl font-black tracking-tight uppercase">ChatApp</h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-xl">help</span>
            <span>Support</span>
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center p-6 z-10">
          <div className="w-full max-w-md flex flex-col gap-8">
            {/* Hero Text */}
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-black tracking-tight mb-2">Welcome back</h1>
              <p className="text-slate-500 dark:text-primary/60 text-lg">Your community is waiting for you.</p>
            </div>

            {/* Form Container */}
            <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 p-8 rounded-xl shadow-2xl">
              {/* Toggle Switch */}
              <div className="flex bg-slate-100 dark:bg-primary/10 p-1 rounded-xl mb-8">
                <div className="flex-1 py-2 text-sm font-bold rounded-lg bg-white dark:bg-primary text-slate-900 dark:text-white shadow-sm transition-all text-center cursor-default">
                  Login
                </div>
                <Link to="/register" className="flex-1 py-2 text-sm font-semibold text-slate-500 dark:text-primary/70 hover:text-primary transition-all text-center">
                  Sign Up
                </Link>
              </div>

              {/* Input Groups */}
              <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary/40">mail</span>
                    <input 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-primary/30" 
                      placeholder="name@example.com" 
                      type="email" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <a className="text-xs font-semibold text-primary hover:underline" href="#">Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary/40">lock</span>
                    <input 
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-primary/30" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"} 
                      required 
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                <button type="submit" className="mt-2 w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-primary/20"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-background-dark px-4 text-slate-400 dark:text-primary/40 font-bold">Or continue with</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors font-semibold text-sm">
                  <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZsqTFDOOvSaASL5NJJueGsK23gnsyRnU-Xs4DHee3qnDkMZsdV9Z-Zf8GqTwn3x-ZZUJMTBwU5ZW4_-RlxhmpXEssIlZ4vRi-xUb34jtFZQSyge2arh6jChmeSH9GFnriX0zjxk_mealyEY6x0THUsB7HcdN3kuNUZwkoNi0q3GwnZxp00El9F0JxdHuI5FrIKxohRyRJe0QmTy0rj9RqJajp5ST8ZnWB59j-uA-JvK8M2NugI9u4GCMhrmq0dcPON0yu5V5qhfU" />
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-primary/20 rounded-xl hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors font-semibold text-sm">
                  <img alt="Apple Logo" className="w-5 h-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfzH-_U-JVAaYiPg6hFwdEnGPHCSbfSSqH_Mj1B0bCiQIuSNI9oOecDIFQRRwRZALSgrsT-umDVQFTRdAx14xSPgkGLvS08rYHJt9Tzt5DfgX0xykK11ncVyqx_RqVdZAyzJaivrjHTJtB-jJ9Xa3Uchgrmp19J-N6ZYPHsT3E74DAOMsjG6HfElo1kHUdwtWo0CXRu2Dags_Bcq-GzGj8dFPTrkSZ3mUpibmTV-7Qs-hyRNkRC3pRW-9oxkLwuyjKsuVc_111YOE" />
                  Apple
                </button>
              </div>
            </div>

            {/* Footer Link */}
            <p className="text-center text-sm text-slate-500 dark:text-primary/50">
              By signing in, you agree to our{' '}
              <a className="text-primary font-semibold hover:underline" href="#">Terms</a> and{' '}
              <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>
            </p>
          </div>
        </main>

        {/* Decorative Elements */}
        <div className="fixed -z-10 top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
}
