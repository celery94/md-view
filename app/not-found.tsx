import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description:
    'The page you are looking for could not be found. Return to MD-View markdown editor.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-white py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-[14px] border border-[#dddddd] bg-white px-4 py-8 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] sm:px-10">
          <div className="text-center">
            <h1 className="mb-4 text-6xl font-bold text-[#222222]">404</h1>
            <h2 className="mb-4 text-2xl font-bold text-[#222222]">Page Not Found</h2>
            <p className="mb-8 text-[#6a6a6a]">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="flex w-full justify-center rounded-[8px] bg-[#ff385c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e00b41] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/35 focus:ring-offset-2"
              >
                Return to MD-View Editor
              </Link>
              <a
                href="https://github.com/celery94/md-view/issues"
                className="flex w-full justify-center rounded-[8px] border border-[#222222] bg-white px-4 py-2 text-sm font-medium text-[#222222] transition-colors hover:bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-[#ff385c]/35 focus:ring-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
