export const ui = {
  home: {
    root: 'relative isolate min-h-screen flex flex-col overflow-hidden bg-transparent text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85',

    headerInner: 'flex w-full flex-col gap-2.5 px-3 pb-3 pt-3 sm:gap-3 sm:px-4 sm:py-3 lg:px-5',

    navRow:
      'flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30 focus-visible:ring-offset-2',

    statPill:
      'hidden xl:flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600',

    main: 'relative flex flex-1 min-h-0 flex-col gap-0',

    container:
      'relative flex w-full flex-1 min-h-0 flex-col items-stretch gap-3 bg-transparent px-3 pb-3 pt-2 sm:px-4 sm:pb-4 lg:gap-4 lg:px-5 lg:pb-5',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-300/55 bg-white/86 p-0 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.65)] ring-1 ring-white/60 backdrop-blur-md',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:bg-slate-50 active:scale-[0.97]',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-lg bg-cyan-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-cyan-600 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 md:px-4 md:py-2 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 focus-visible:ring-offset-2 md:px-3.5 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent p-2 text-xs font-medium text-slate-500 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-[0.95] md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code overflow-hidden',
      header:
        'mdv-code-header flex items-center justify-between gap-2 px-4 py-2',
      languageBadge:
        'language-badge select-none text-[11px] font-semibold uppercase tracking-[0.08em]',
      copyButton:
        'copy-button inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/35 active:scale-[0.97]',
    },
  },
} as const;
