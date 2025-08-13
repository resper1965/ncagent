import Link from 'next/link';
import { Button } from './button';
import { Logo } from './logo';
import { IonicLogo } from './ionic-logo';
import { GabiIcon } from './gabi-icon';

export function Navbar() {
  return (
    <header className="border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <GabiIcon size={28} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">n.Agent</h1>
              <p className="text-sm text-gray-300">Intelligent Document Assistant</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Home</Link>
            <Link href="/ask" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Chat</Link>
            <Link href="/agents" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Agentes</Link>
            <Link href="/documents" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Documents</Link>
            <Link href="/upload" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Upload</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <IonicLogo size={32} className="text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
