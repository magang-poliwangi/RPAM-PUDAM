export default function Modal({ open, title, onClose, children, size = 'md' }) {
  if (!open) return null;
  const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size] || 'max-w-lg';
  return (
    <div className="app-overlay">
      <div className={`app-modal ${sizeClass}`}>
        <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
          <h2 className="text-base font-semibold text-app-text">{title}</h2>
          <button
            onClick={onClose}
            className="app-icon-button flex h-8 w-8 items-center cursor-pointer justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4 scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}
