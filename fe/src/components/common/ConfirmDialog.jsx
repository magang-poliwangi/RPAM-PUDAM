export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Hapus', danger = true }) {
  if (!open) return null;
  return (
    <div className="app-overlay">
      <div className="app-modal max-w-sm p-6">
        <h3 className="mb-2 text-lg font-semibold text-app-text">{title}</h3>
        <p className="mb-6 text-sm text-app-text-muted">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="app-button-secondary"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-700 hover:bg-teal-800'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
