'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-300/50 bg-gradient-to-b from-white/75 to-slate-100/65 backdrop-blur">
      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />

      <div className="relative w-full px-6 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
            <span>©</span>
            <span>{currentYear}</span>
            <span className="bg-gradient-to-r from-slate-800 to-cyan-800 bg-clip-text font-semibold text-transparent">
              MD-View
            </span>
            <span className="text-slate-200">•</span>
            <span className="text-slate-400">Free and open source</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* No registration badge */}
            <span className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300/65 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-cyan-300/60 hover:bg-white hover:shadow">
              <svg className="h-3.5 w-3.5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No registration
            </span>

            {/* Privacy first badge */}
            <span className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300/65 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-cyan-300/60 hover:bg-white hover:shadow">
              <svg className="h-3.5 w-3.5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Privacy first
            </span>

            {/* Always free badge */}
            <span className="group inline-flex items-center gap-1.5 rounded-full border border-slate-300/65 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-amber-300/70 hover:bg-white hover:shadow">
              <svg className="h-3.5 w-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
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

