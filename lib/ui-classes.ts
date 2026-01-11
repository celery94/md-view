export const ui = {
  home: {
    root: 'relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-slate-200/40 bg-white/60 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.02)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300',

    headerInner: 'flex w-full flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-10 xl:px-12',

    navRow: 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/50 px-4 py-2.5 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_25px_-4px_rgba(14,165,233,0.15)] hover:scale-[1.02] hover:border-sky-200/40 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',

    statPill:
      'hidden xl:flex items-center gap-3 rounded-full border border-slate-200/40 bg-white/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.02)] backdrop-blur-md ring-1 ring-white/50 transition-colors hover:bg-white/60 hover:border-sky-100',

    main: 'relative flex flex-1 min-h-0 flex-col gap-6 py-6 sm:py-8 lg:py-12',

    container:
      'relative flex w-full flex-1 flex-col gap-6 xl:gap-8 px-4 sm:px-6 lg:px-10 xl:px-12 min-h-0',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[30px] border border-white/70 bg-gradient-to-br from-white/95 via-white/85 to-slate-50/80 p-5 sm:p-7 lg:p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08),0_6px_16px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl ring-1 ring-slate-200/40',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-xl border border-slate-200/50 bg-white/50 px-4 py-3 text-xs font-semibold text-slate-700 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.1)] hover:scale-[1.03] hover:border-slate-300/60 hover:bg-white/80 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(14,165,233,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_10px_30px_rgba(14,165,233,0.45)] hover:scale-[1.03] hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-4 md:py-2.5 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-xl border border-slate-200/50 px-2.5 py-2 text-xs font-medium text-slate-600 bg-white/40 backdrop-blur-md transition-all duration-300 hover:text-slate-900 hover:bg-white/90 hover:shadow-[0_4px_16px_-4px_rgba(15,23,42,0.1)] hover:scale-[1.03] hover:border-slate-300/60 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-medium text-slate-500 transition-all duration-300 hover:text-sky-700 hover:bg-sky-50/80 hover:shadow-[0_2px_8px_rgba(14,165,233,0.15)] hover:scale-110 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code',
      controls:
        'absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200',
      languageBadge:
        'language-badge select-none rounded-full border border-sky-200/80 bg-gradient-to-br from-sky-50 to-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 shadow-[0_2px_8px_rgba(14,165,233,0.15)] backdrop-blur-sm',
      copyButton:
        'copy-button inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.12)] hover:scale-105 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
    },
  },
} as const;
