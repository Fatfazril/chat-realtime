import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(username, email, password);
      // Backend automatically logs user in upon registration
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header/Navigation */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/20 px-6 md:px-10 py-4 bg-background-light dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">ChatApp</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 text-sm">Already have an account?</span>
              <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-bold">
                <span>Login</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4 md:p-10 z-10">
            <div className="w-full max-w-[480px] space-y-8">
              {/* Title Section */}
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Create Account</h1>
                <p className="text-slate-500 dark:text-primary/60 text-lg font-normal">Join the next generation of real-time communication.</p>
              </div>

              {/* Registration Form */}
              <form className="space-y-5" onSubmit={handleRegister}>
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-500/20">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold ml-1">Username</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                    <input 
                      className="w-full bg-slate-100 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl h-14 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                      placeholder="johndoe" 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold ml-1">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                    <input 
                      className="w-full bg-slate-100 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl h-14 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                      placeholder="name@example.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-700 dark:text-slate-200 text-sm font-semibold ml-1">Password</label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                    <input 
                      className="w-full bg-slate-100 dark:bg-primary/10 border border-slate-200 dark:border-primary/20 rounded-xl h-14 pl-12 pr-14 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button 
                      className="absolute right-4 text-slate-400 hover:text-primary transition-colors" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-1">Must be at least 8 characters long.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-primary/20"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">Or sign up with</span>
                <div className="flex-grow border-t border-slate-200 dark:border-primary/20"></div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 rounded-xl transition-all">
                  <img alt="Google Logo" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMx8iZwVZz67DHsCNTZI2sSAs9Tcv1yswyDKhM44yCIoEwDBkzISEV7kEBSbBh2xh0dR8MmaTpa3qr630XIp4PnA8aVdDJSJw66ZGan4XkVBxtrGSKUJ7ToiQBmF_20NN9jbwVINv-SQUj3mwQ_26EboZXdIgDijG6n3fw5pQ86sXdUh_ZXYISAUjcL6J00Hq_vxR77w1_td7Qxd1cmhAzXPZmIgWxf9u6Wrp6uRhrDn2a41byb_Tx3AU83IZns7RaCf0NCDPbs2E" />
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 rounded-xl transition-all">
                  <img alt="Apple Logo" className="w-5 h-5 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQShkgjzo-G9tFSjshPK1V7wuclx6T3UOTYHUiUSYxPIuSgIEmQkMmviT4MgKSWHbdFN4K42ElvcEh29tZVdd6ez2zIeOmJQfkPEbxBcrruZEV_JjpnHpm_TyUgrjPBzizX07VN9p4vcOITRdGCUuwHHRJ2DO_Q5UO2hvLcORxsHVroU7JYboSo_ImH31NzHJDPlTAOOcCX_IHQQzpeARViinQCh9hw_v2ShGiwecBGHLogdI2_EqK9nnXdFjyp_w4mEATr-cTIps" />
                  <span className="text-slate-700 dark:text-slate-200 font-semibold text-sm">Apple</span>
                </button>
              </div>

              {/* Footer Link */}
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
                By signing up, you agree to our{' '}
                <a className="text-primary hover:underline underline-offset-4" href="#">Terms of Service</a> and{' '}
                <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
              </p>
            </div>
          </main>

          {/* Decorative background element */}
          <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10"></div>
          <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        </div>
      </div>
    </div>
  );
}
