import { useCallback, useState } from 'react';

export default function useModalForm(emptyForm) {
  const [modal, setModal] = useState({ open: false, mode: 'add', form: emptyForm });

  const openAdd = useCallback(() => setModal({ open: true, mode: 'add', form: emptyForm }), [emptyForm]);
  const openEdit = useCallback((row) => setModal({ open: true, mode: 'edit', form: { ...row } }), []);
  const close = useCallback(() => setModal({ open: false, mode: 'add', form: emptyForm }), [emptyForm]);
  const setForm = useCallback((form) => setModal((m) => ({ ...m, form })), []);

  return { modal, openAdd, openEdit, close, setForm };
}