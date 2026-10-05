import React from 'react';
import { PlaySquare } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-base py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <PlaySquare className="h-5 w-5 text-accent" />
          <span className="text-lg font-bold tracking-tight text-text-primary">VideoSocial</span>
        </div>
        
        <nav className="flex gap-6 text-sm text-text-secondary">
          <Link to="#" className="hover:text-accent transition-colors">About</Link>
          <Link to="#" className="hover:text-accent transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-accent transition-colors">Terms</Link>
          <Link to="#" className="hover:text-accent transition-colors">Contact</Link>
        </nav>

        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} VideoSocial. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
