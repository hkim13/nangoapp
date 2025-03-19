'use client';

import Link from 'next/link';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com' },
    { name: 'Dribbble', href: 'https://dribbble.com' },
    { name: 'Instagram', href: 'https://instagram.com' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Top section with Contact */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal mb-4">Contact</h2>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Main Links */}
          <div className="space-y-4">
            {navigation.main.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            {navigation.legal.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            {navigation.social.map((item) => (
              <div key={item.name} className="flex items-center">
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            &copy; 2025 Seamless-ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
