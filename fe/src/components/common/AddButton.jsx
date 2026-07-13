import { PlusIcon } from './icons';

export default function AddButton({ onClick, label = 'Tambah', id }) {
  return (
    <button id={id} type="button" onClick={onClick} className="app-button-primary cursor-pointer flex items-center gap-2">
      <PlusIcon />
      {label}
    </button>
  );
}