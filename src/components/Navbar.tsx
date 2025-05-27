import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Brain } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Rewriter', path: '/rewriter' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-apple-blue" />
              <span className="text-lg font-medium text-apple-black">AI Humanizer</span>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-apple-blue'
                      : 'text-gray-600 hover:text-apple-black'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </NavLink>
              </div>
            )}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-full text-gray-600 hover:text-apple-black hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-full text-base font-medium ${
                    isActive
                      ? 'text-apple-blue bg-apple-blue/5'
                      : 'text-gray-600 hover:text-apple-black hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-apple-black hover:bg-gray-50 rounded-full"
              >
                Logout
              </button>
            ) : (
              <div className="p-3 space-y-2">
                <NavLink to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/signup" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="primary" fullWidth>
                    Sign Up
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;