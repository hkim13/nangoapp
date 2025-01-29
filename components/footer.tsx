'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; 2025 Seamless-ai. All rights reserved.
          </div>
          <div className="flex space-x-8">
            <div className="text-sm">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            <div className="text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
