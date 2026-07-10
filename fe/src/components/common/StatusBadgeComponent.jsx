export default function StatusBadgeComponent({ isActive }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isActive ? "bg-brand-100 text-brand-700" : "bg-neutral-100 text-neutral-600"
            }`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-brand-500" : "bg-neutral-400"}`} />
            {isActive ? "Aktif" : "Tidak Aktif"}
        </span>
    );
}
