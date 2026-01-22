export const ui = {
  home: {
    root: 'relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80 text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_1px_3px_rgb(15_23_42/0.04)] transition-all duration-300',

    headerInner: 'flex w-full flex-col gap-3 px-4 py-2.5 sm:px-6 lg:px-8',

    navRow: 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100/80 hover:border-slate-200/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2',

    statPill:
      'hidden xl:flex items-center gap-2.5 rounded-full border border-slate-200/60 bg-gradient-to-r from-slate-50 to-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 shadow-sm',

    main: 'relative flex flex-1 min-h-0 flex-col gap-0',

    container:
      'relative flex w-full flex-1 flex-col md:flex-row items-stretch gap-0 min-h-0 bg-gradient-to-b from-white to-slate-50/30',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white p-0',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow active:scale-[0.97]',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-200 hover:from-slate-700 hover:to-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 md:px-4 md:py-2 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 px-3 py-2 text-xs font-medium text-slate-600 bg-white transition-all duration-200 hover:text-slate-900 hover:bg-gradient-to-b hover:from-slate-50 hover:to-white hover:border-slate-300 hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 md:px-3.5 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-xl p-2 text-xs font-medium text-slate-400 transition-all duration-200 hover:text-slate-700 hover:bg-slate-100/80 active:scale-[0.95] md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code overflow-hidden',
      controls:
        'absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200',
      languageBadge:
        'language-badge select-none rounded-lg bg-slate-100/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200/60 shadow-sm',
      copyButton:
        'copy-button inline-flex items-center gap-1 rounded-lg border border-slate-200/60 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow active:scale-[0.97]',
    },
  },
} as const;
