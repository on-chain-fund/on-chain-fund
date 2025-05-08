import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from './providers';
import Header from './components/Header';

export const metadata = {
  title: 'OnChainFund - Decentralized Crowdfunding',
  description: 'Fund and create projects on the blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-4">
              {children}
            </main>
            <footer className="bg-white border-t py-6">
              <div className="container mx-auto px-4 text-center text-gray-500">
                <p>© 2025 OnChainFund. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}