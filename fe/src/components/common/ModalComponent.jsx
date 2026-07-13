import { IoCloseOutline } from "react-icons/io5";

export default function ModalComponent({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-brand-900/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl">
                <div className="relative flex items-center justify-between overflow-hidden bg-brand-900 px-5 py-4 sm:px-6">
                    <div className="pointer-events-none absolute -right-5 -top-9 h-24 w-24 rounded-full bg-brand-500/40" />
                    <div className="relative">
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Pengaturan akun</p>
                        <h2 className="font-display text-lg font-bold text-white">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="relative rounded-lg p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                    >
                        <IoCloseOutline className="text-xl" />
                    </button>
                </div>
                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}
