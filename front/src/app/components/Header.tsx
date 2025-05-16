'use client';
import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownFundLink, WalletDropdownDisconnect, WalletAdvancedTokenHoldings, WalletAdvancedAddressDetails } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import CreateCampaignButton from './CreateCampaignButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    // For root path, we need exact match
    if (path === '/') {
      return pathname === path;
    }
    // For other paths, check if the pathname starts with the path
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">OnChainFund</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/home" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/home') 
                    ? 'border-blue-500 text-black' 
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/portfolio" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/portfolio') 
                    ? 'border-blue-500 text-black' 
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                Portfolio
              </Link>
              <Link 
                href="/how-it-works" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/how-it-works') 
                    ? 'border-blue-500 text-black' 
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                How It Works
              </Link>
              {/* <Link 
                href="/vote" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/how-it-works') 
                    ? 'border-blue-500 text-black' 
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                Vote
              </Link> */}
            </nav>
          </div>
          <div className="hidden sm:flex items-center space-x-4 relative">
            <CreateCampaignButton />
            <Wallet>
              <ConnectWallet className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Identity className="!bg-transparent">
                  <Avatar className="h-6 w-6 mr-2 bg-transparent" />
                  <Name className="text-white" />
                </Identity>
              </ConnectWallet>
              <WalletDropdown>
                <WalletAdvancedAddressDetails />
                <WalletAdvancedTokenHoldings />
                <WalletDropdownFundLink />
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/explore" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/explore')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
            }`}
          >
            Explore
          </Link>
          <Link 
            href="/how-it-works" 
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/how-it-works')
                ? 'border-blue-500 text-blue-700 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'
            }`}
          >
            How It Works
          </Link>
          <div className="pl-3 pr-4 py-2 space-y-2">
            <Wallet>
              <ConnectWallet className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full">
                <Identity className="!bg-transparent">
                  <Avatar className="h-6 w-6 mr-2 bg-transparent" />
                  <Name className="text-white" />
                </Identity>
              </ConnectWallet>
              <WalletDropdown>
                <WalletDropdownFundLink />
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </div>
      </div>
    </header>
  );
}
