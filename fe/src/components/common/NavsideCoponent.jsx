import { useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoCloseOutline, IoMenuOutline, IoWaterOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { asyncUnsetAuthUser } from "../../states/authUser/action";

const navItems = [
    { icon: GoHomeFill, label: "Beranda", link: "/", key: "home" },
    { icon: FaUser, label: "Manajemen User", link: "/management-user", key: "managementUser" },
];

export default function NavbarSideComponent() {
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (link) => (link === "/" ? pathname === "/" : pathname.startsWith(link));
    const closeMenu = () => setIsOpen(false);

    const onLogout = async () => {
        closeMenu();
        await dispatch(asyncUnsetAuthUser());
    };

    return (
        <>
            <button
                type="button"
                aria-label="Buka navigasi"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(true)}
                className="fixed left-4 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white shadow-lg transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 md:hidden"
            >
                <IoMenuOutline className="text-xl" />
            </button>

            {isOpen && (
                <button
                    type="button"
                    aria-label="Tutup navigasi"
                    onClick={closeMenu}
                    className="fixed inset-0 z-40 bg-brand-900/45 backdrop-blur-[1px] md:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col overflow-hidden bg-brand-900 px-4 py-6 shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 md:shadow-none ${
                    isOpen ? "translate-x-0" : ""
                }`}
            >
                <div className="pointer-events-none absolute -right-16 -top-12 h-48 w-48 rounded-full bg-brand-500/25" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand-700/70" />

                <div className="relative mb-7 flex items-center gap-3 border-b border-white/15 px-2 pb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <IoWaterOutline className="text-xl" />
                    </div>
                    <div>
                        <p className="font-display text-base font-bold text-white">RPAM</p>
                        <p className="text-[11px] text-brand-300">Rencana Pengamanan Air</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Tutup navigasi"
                        onClick={closeMenu}
                        className="ml-auto rounded-lg p-1 text-brand-200 transition hover:bg-white/10 hover:text-white md:hidden"
                    >
                        <IoCloseOutline className="text-2xl" />
                    </button>
                </div>

                <nav className="relative flex flex-1 flex-col gap-1.5" aria-label="Navigasi utama">
                    {navItems.map(({ icon: Icon, label, key, link }) => {
                        const active = isActive(link);
                        return (
                            <Link
                                to={link}
                                key={key}
                                onClick={closeMenu}
                                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                    active
                                        ? "bg-white text-brand-800 shadow-sm"
                                        : "text-brand-100 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <Icon className={`text-lg ${active ? "text-brand-600" : "text-brand-300"}`} />
                                {label}
                                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative mt-5 border-t border-white/15 pt-4">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-brand-100 transition hover:bg-red-400/15 hover:text-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                    >
                        <MdLogout className="text-lg" />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}
