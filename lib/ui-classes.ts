export const ui = {
  home: {
    root: 'relative min-h-screen flex flex-col overflow-hidden bg-slate-50 text-slate-900',

    header:
      'sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm transition-all duration-300',

    headerInner: 'flex w-full flex-col gap-4 px-4 py-3 sm:px-6 lg:px-8',

    navRow: 'flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-all duration-200 hover:bg-slate-100 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-1',

    statPill:
      'hidden xl:flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500',

    main: 'relative flex flex-1 min-h-0 flex-col gap-0',

    container:
      'relative flex w-full flex-1 flex-col md:flex-row items-stretch gap-0 min-h-0 bg-white',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white p-0',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 md:px-4 md:py-2 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-600 bg-white transition-all duration-200 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:scale-95 focus-visible:outline focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 md:px-3 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-lg p-2 text-xs font-medium text-slate-500 transition-all duration-200 hover:text-slate-900 hover:bg-slate-100 active:scale-95 md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code',
      controls:
        'absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200',
      languageBadge:
        'language-badge select-none rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200',
      copyButton:
        'copy-button inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95',
    },
  },
} as const;
