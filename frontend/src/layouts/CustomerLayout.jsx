import Navbar from "../components/Navbar";

function CustomerLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main>
                {children}
            </main>

            <footer className="mt-16 border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500 md:px-8">
                    © 2026 ShopNest. Cosmetics & General Store.
                </div>
            </footer>

        </div>
    );
}

export default CustomerLayout;