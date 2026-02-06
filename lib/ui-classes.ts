export const ui = {
  home: {
    root: 'relative isolate min-h-screen flex flex-col overflow-hidden bg-transparent text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-slate-300/40 bg-gradient-to-b from-white/88 via-white/82 to-slate-100/70 backdrop-blur-xl shadow-[0_12px_28px_-24px_rgba(15,23,42,0.7)] supports-[backdrop-filter]:bg-white/70 transition-all duration-300',

    headerInner: 'flex w-full flex-col gap-2.5 px-3 pb-3 pt-3 sm:gap-3 sm:px-4 sm:py-3 lg:px-5',

    navRow:
      'flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white/65 px-2.5 py-1.5 shadow-[0_4px_14px_-10px_rgba(15,23,42,0.45)] transition-all duration-200 hover:border-cyan-300/50 hover:bg-white/90 hover:shadow-[0_10px_24px_-18px_rgba(8,145,178,0.7)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2',

    statPill:
      'hidden xl:flex items-center gap-2.5 rounded-full border border-slate-300/60 bg-gradient-to-r from-white to-slate-100/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-[0_4px_12px_-10px_rgba(15,23,42,0.45)]',

    main: 'relative flex flex-1 min-h-0 flex-col gap-0',

    container:
      'relative flex w-full flex-1 min-h-0 flex-col items-stretch gap-3 bg-transparent px-3 pb-3 pt-2 sm:px-4 sm:pb-4 lg:gap-4 lg:px-5 lg:pb-5',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-300/55 bg-white/86 p-0 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.65)] ring-1 ring-white/60 backdrop-blur-md',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-xl border border-slate-300/70 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-cyan-300/60 hover:bg-white hover:text-slate-900 hover:shadow active:scale-[0.97]',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-700 via-cyan-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_22px_-14px_rgba(8,145,178,0.95)] transition-all duration-200 hover:from-cyan-600 hover:to-teal-500 hover:shadow-[0_14px_30px_-16px_rgba(8,145,178,0.95)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/55 focus-visible:ring-offset-2 md:px-4 md:py-2 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-xl border border-slate-300/70 bg-white/80 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-cyan-300/60 hover:bg-white hover:text-slate-900 hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2 md:px-3.5 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent p-2 text-xs font-medium text-slate-500 transition-all duration-200 hover:border-slate-300/60 hover:bg-white/90 hover:text-slate-800 active:scale-[0.95] md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code overflow-hidden',
      controls:
        'absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200',
      languageBadge:
        'language-badge select-none rounded-lg border border-slate-300/70 bg-white/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 shadow-sm backdrop-blur-sm',
      copyButton:
        'copy-button inline-flex items-center gap-1 rounded-lg border border-slate-300/65 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-cyan-300/60 hover:bg-white hover:text-slate-900 hover:shadow active:scale-[0.97]',
    },
  },
} as const;
