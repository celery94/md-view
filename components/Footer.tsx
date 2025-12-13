'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.04),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.04),transparent_50%)]" />
      
      {/* Top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
      
      <div className="relative w-full px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span className="text-slate-400">©</span>
            <span>{currentYear}</span>
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-bold">
              MD-View
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Free and open source</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* No registration badge */}
            <span className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/50 shadow-[0_2px_8px_rgba(16,185,129,0.1)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:scale-[1.02]">
              <svg className="h-3.5 w-3.5 text-emerald-500 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No registration
            </span>
            
            {/* Privacy first badge */}
            <span className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 px-4 py-2 text-xs font-semibold text-sky-700 ring-1 ring-sky-200/50 shadow-[0_2px_8px_rgba(14,165,233,0.1)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(14,165,233,0.15)] hover:scale-[1.02]">
              <svg className="h-3.5 w-3.5 text-sky-500 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Privacy first
            </span>
            
            {/* Always free badge */}
            <span className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-4 py-2 text-xs font-semibold text-violet-700 ring-1 ring-violet-200/50 shadow-[0_2px_8px_rgba(139,92,246,0.1)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)] hover:scale-[1.02]">
              <svg className="h-3.5 w-3.5 text-violet-500 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              Always free
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

