'use client';

import Link from 'next/link';

const navigation = {
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  social: [
    { name: 'Skool', href: 'https://www.skool.com/seamless-8336' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Simple footer with horizontal layout */}
        <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 border-t border-gray-800 pt-8">
          {navigation.legal.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="h-4 w-px bg-gray-700"></div>
          {navigation.social.map((item) => (
            <Link
              key={item.name}
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
          ))}
        </div>
      </div>
    </footer>
  );
}
