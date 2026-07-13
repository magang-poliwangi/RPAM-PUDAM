import { useCallback, useState } from 'react';

const DEFAULT_STATE = { open: false, row: null, action: 'delete' };

export default function useConfirmDialog(actionHandlers, { errorFallback = 'Gagal memproses aksi' } = {}) {
  const [confirm, setConfirm] = useState(DEFAULT_STATE);
  const [processing, setProcessing] = useState(false);

  const open = useCallback((row, action = 'delete') => setConfirm({ open: true, row, action }), []);
  const close = useCallback(() => setConfirm(DEFAULT_STATE), []);

  const confirmAction = useCallback(async () => {
    const handler = actionHandlers[confirm.action];
    if (!handler || !confirm.row) return close();
    setProcessing(true);
    try {
      await handler(confirm.row);
      close();
    } catch (err) {
      alert(err?.response?.data?.message || errorFallback);
    } finally {
      setProcessing(false);
    }
  }, [confirm, actionHandlers, close, errorFallback]);

  return { confirm, open, close, confirmAction, processing };
}