import React from 'react';
import AuthComponent from '@/components/AuthComponent';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-blue via-slate-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-solar-orange/20 via-transparent to-gold-accent/20"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-tech-blue/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-solar-orange/30 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-accent rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-solar-orange rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse delay-500"></div>
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">BooksBoardroom</h1>
          <p className="text-slate-300 text-lg">AI-Powered Financial Intelligence</p>
          <div className="w-24 h-1 bg-gradient-to-r from-solar-orange to-gold-accent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="backdrop-blur-lg bg-white/10 rounded-xl shadow-2xl border border-white/20 p-8">
          <AuthComponent redirectTo="/back-office" />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">Secure authentication powered by Firebase</p>
        </div>
      </div>
    </div>
  );
} 