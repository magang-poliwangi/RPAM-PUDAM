import { useSelector } from "react-redux";
import { IoPeopleOutline, IoPersonAddOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import LayoutMainContent from "../../components/common/LayoutMainContent";

export default function DashboardPage() {
    const { users = [] } = useSelector((states) => states);
    const activeUsers = users.filter((user) => user.isActive).length;
    const cards = [
        { label: "Total pengguna", value: users.length, icon: IoPeopleOutline, tone: "bg-brand-100 text-brand-700" },
        { label: "Pengguna aktif", value: activeUsers, icon: IoShieldCheckmarkOutline, tone: "bg-emerald-100 text-emerald-700" },
        { label: "Pengguna nonaktif", value: users.length - activeUsers, icon: IoPersonAddOutline, tone: "bg-neutral-100 text-neutral-600" },
    ];

    return (
        <LayoutMainContent>
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                <section className="relative overflow-hidden rounded-2xl bg-brand-900 px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
                    <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand-600/60" />
                    <div className="pointer-events-none absolute bottom-0 right-24 h-20 w-20 translate-y-10 rounded-full border-[18px] border-brand-500/30" />
                    <div className="relative max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">Dashboard RPAM</p>
                        <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">Selamat datang di pusat kontrol RPAM</h1>
                        <p className="mt-3 text-sm leading-6 text-brand-100 sm:text-base">Kelola akses pengguna dan pantau informasi sistem dari satu tempat.</p>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    {cards.map(({ label, value, icon: Icon, tone }) => (
                        <article key={label} className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon className="text-xl" /></div>
                            <p className="mt-4 text-sm font-medium text-neutral-500">{label}</p>
                            <p className="mt-1 font-display text-3xl font-bold text-brand-900">{value}</p>
                        </article>
                    ))}
                </section>
            </div>
        </LayoutMainContent>
    );
}
