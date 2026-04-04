import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Menu, X, BrainCircuit, User as UserIcon, LogOut, PlusCircle, Trophy, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };
// Define navLinks once with the dynamic logic
const navLinks = [
  { name: 'Explore', path: '/explore', icon: Compass },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  // Spreads the object into the array ONLY if currentUser exists
  ...(currentUser ? [{ name: 'Your Quizzes', path: '/profile', icon: UserIcon }] : []),
];

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-brand-blue/10 rounded-lg group-hover:bg-brand-blue/20 transition-colors">
                <BrainCircuit className="w-6 h-6 text-brand-blue" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                ADHYAYAN
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
              
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full border border-brand-blue/50"
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-slate-900 border border-white/10 py-1"
                      >
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                          <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                        >
                          <UserIcon className="w-4 h-4" /> Profile
                        </Link>
                        <Link
                          to="/create"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-brand-coral hover:bg-white/5"
                        >
                          <PlusCircle className="w-4 h-4" /> Create Quiz
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-sm font-medium bg-brand-blue text-brand-navy hover:bg-brand-blue/90 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-slate-900 border-b border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {currentUser && (
                <Link
                  to="/create"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-brand-coral hover:bg-white/5"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create Quiz
                </Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-white/10">
              {currentUser ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="shrink-0">
                      <img className="h-10 w-10 rounded-full" src={currentUser.avatar} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                      <div className="text-sm font-medium leading-none text-slate-400 mt-1">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-5 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 border border-white/20 rounded-md text-base font-medium text-white hover:bg-white/5"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-4 py-2 rounded-md text-base font-medium bg-brand-blue text-brand-navy hover:bg-brand-blue/90"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
