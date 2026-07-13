const base = { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' };
const path = { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2 };

export const PlusIcon = () => (
  <svg {...base}><path {...path} d="M12 4v16m8-8H4" /></svg>
);
export const EditIcon = () => (
  <svg {...base}><path {...path} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
export const DeleteIcon = () => (
  <svg {...base}><path {...path} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
export const ActivateIcon = () => (
  <svg {...base}><path {...path} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
export const DeactivateIcon = () => (
  <svg {...base}><path {...path} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
);