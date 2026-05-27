export const ui = {
  home: {
    root: 'relative min-h-screen flex flex-col bg-white text-[#222222]',

    header:
      'sticky top-0 z-30 border-b border-[#dddddd] bg-white',

    headerInner: 'flex w-full flex-col gap-2.5 px-3 pb-3 pt-3 sm:gap-3 sm:px-4 sm:py-3 lg:px-5',

    navRow:
      'flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4',

    brandLink:
      'group flex items-center gap-2 rounded-[8px] px-2.5 py-1.5 transition-colors duration-150 hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/30 focus-visible:ring-offset-2',

    statPill:
      'hidden xl:flex items-center gap-2.5 rounded-full border border-[#dddddd] bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6a6a6a]',

    main: 'relative flex flex-1 min-h-0 flex-col gap-0',

    container:
      'relative flex w-full flex-1 min-h-0 flex-col items-stretch gap-3 bg-white px-3 pb-3 pt-2 sm:px-4 sm:pb-4 lg:gap-4 lg:px-5 lg:pb-5',

    panel:
      'relative flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[14px] border border-[#dddddd] bg-white p-0 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)]',

    mobileActionButton:
      'inline-flex flex-none items-center gap-2 rounded-[8px] border border-[#dddddd] bg-white px-3.5 py-2 text-xs font-medium text-[#222222] transition-colors duration-150 hover:bg-[#f7f7f7] active:scale-[0.97]',

    buttons: {
      primary:
        'inline-flex items-center gap-1.5 rounded-[8px] bg-[#ff385c] px-3.5 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#e00b41] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/35 focus-visible:ring-offset-2 md:px-4 md:py-2 md:text-sm',

      secondary:
        'inline-flex items-center gap-1.5 rounded-[8px] border border-[#222222] bg-white px-3 py-2 text-xs font-medium text-[#222222] transition-colors duration-150 hover:bg-[#f7f7f7] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/35 focus-visible:ring-offset-2 md:px-3.5 md:text-sm',

      quietNav:
        'inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-transparent p-2 text-xs font-medium text-[#6a6a6a] transition-colors duration-150 hover:bg-[#f7f7f7] hover:text-[#222222] active:scale-[0.95] md:p-2.5',
    },
  },

  preview: {
    code: {
      wrapper: 'relative group mdv-code overflow-hidden rounded-[14px] ring-1 ring-black/5',
      header:
        'mdv-code-header flex items-center justify-between gap-3 px-4 py-2.5',
      languageBadge:
        'language-badge inline-flex items-center rounded-full border border-current/10 bg-transparent px-2.5 py-1 select-none text-[10px] font-semibold uppercase tracking-[0.14em]',
      copyButton:
        'copy-button inline-flex items-center gap-1.5 rounded-full border border-current/15 bg-transparent px-2.5 py-1 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/35 active:scale-[0.97]',
    },
  },
} as const;
