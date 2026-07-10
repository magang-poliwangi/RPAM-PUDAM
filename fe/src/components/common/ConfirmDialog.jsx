function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'default', // 'default' | 'destructive'
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const confirmClasses = variant === 'destructive'
    ? 'bg-status-error hover:bg-red-700 text-white'
    : 'bg-brand-700 hover:bg-brand-600 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        {message && <p className="mt-2 text-sm text-neutral-500">{message}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;