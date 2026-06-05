import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Weather AI proxy and query UI using Next.js App Router',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Weather App</h1>
            <div className="text-sm text-slate-500">Powered by Weather AI</div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
