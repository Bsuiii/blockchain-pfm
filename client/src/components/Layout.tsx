import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-full">
              <Zap className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-medium">Web3 dApp</span>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;