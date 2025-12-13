export const ui = {
  home: {
    root:
      'relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-white/50 bg-white/70 shadow-[0_1px_0_rgba(148,163,184,0.1),0_20px_50px_-20px_rgba(15,23,42,0.2)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60',

    headerInner:
      'flex w-full flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10 xl:px-12',

    navRow: 'flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3',

    brandLink:
      'group flex items-center gap-3 rounded-2xl border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-slate-50/80 px-4 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] hover:scale-[1.02] hover:border-sky-200/50 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',

    statPill:
      'hidden xl:flex items-center gap-3 rounded-full border border-slate-200/40 bg-gradient-to-r from-white/90 via-slate-50/50 to-white/90 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 shadow-[0_2px_16px_rgba(15,23,42,0.08)] backdrop-blur-md ring-1 ring-white/60',

    main: 'relative flex flex-1 min-h-0 flex-col py-6 sm:py-8 lg:py-12',

    container:
      'relative flex w-full flex-1 flex-col gap-5 px-4 sm:px-6 lg:px-10 xl:px-12 min-h-0',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-white/95 via-white/80 to-slate-50/90 p-5 sm:p-7 lg:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.1),0_8px_20px_rgba(15,23,42,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl ring-1 ring-slate-200/30',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-xl border border-slate-200/60 bg-gradient-to-br from-white via-slate-50/30 to-white px-4 py-3 text-xs font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:scale-[1.03] hover:border-slate-300/80 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(14,165,233,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)] hover:scale-[1.03] hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-4 md:py-2.5 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-xl border border-slate-200/50 px-2.5 py-2 text-xs font-medium text-slate-600 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:text-slate-900 hover:bg-gradient-to-br hover:from-white hover:via-slate-50 hover:to-slate-100 hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] hover:scale-[1.03] hover:border-slate-300/80 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:px-3 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-medium text-slate-500 transition-all duration-300 hover:text-sky-600 hover:bg-sky-50/80 hover:shadow-[0_2px_8px_rgba(14,165,233,0.15)] hover:scale-110 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white md:p-2.5',
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
