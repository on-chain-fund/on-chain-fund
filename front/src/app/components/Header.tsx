'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
export function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 font-[Nunito Sans]">
              OnChainFund
            </Link>
            <nav className="ml-8 hidden md:flex space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Explore
              </Link>
              <Link 
                href="/create" 
                className={`px-3 py-2 rounded-md ${pathname === '/create' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Create
              </Link>
              <Link 
                href="/how-it-works" 
                className={`px-3 py-2 rounded-md ${pathname === '/how-it-works' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                How It Works
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </div>
    </header>
  );
}
