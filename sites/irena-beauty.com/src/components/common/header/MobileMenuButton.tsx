'use client';

const MobileMenuButton = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
  <button
    className="lg:hidden w-[44px] h-[44px] flex items-center justify-center rounded-[10px] bg-text-primary"
    onClick={onToggle}
    aria-label="Toggle menu"
    aria-expanded={open}
  >
    {open ? (
      <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
)

export default MobileMenuButton;
