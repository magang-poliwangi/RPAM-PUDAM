import NavbarSideComponent from "./NavsideCoponent";

export default function LayoutMainContent({ children }) {
    return (
        <section className="min-h-screen bg-brand-50 font-primary md:flex">
            <NavbarSideComponent />
            <main className="min-w-0 flex-1 pt-16 md:pt-0">{children}</main>
        </section>
    );
}
