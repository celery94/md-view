'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-slate-600">
            © {currentYear} MD-View. Free and open source.
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>No registration required</span>
            <span className="text-slate-300">•</span>
            <span>Privacy first</span>
            <span className="text-slate-300">•</span>
            <span>Always free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
