'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; 2025 Your Company. All rights reserved.
          </div>
          <div className="text-sm">
            <Link 
              href="/auth/internal/login" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Internal Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
