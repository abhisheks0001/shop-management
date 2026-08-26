import { Link, NavLink } from "react-router-dom";

function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-gray-900"
                >
                    Shop<span className="text-pink-600">Nest</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-pink-600"
                                : "text-gray-600 transition hover:text-pink-600"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-pink-600"
                                : "text-gray-600 transition hover:text-pink-600"
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-pink-600"
                                : "text-gray-600 transition hover:text-pink-600"
                        }
                    >
                        Login
                    </NavLink>

                </nav>

                <Link
                    to="/products"
                    className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                >
                    Shop Now
                </Link>

            </div>
        </header>
    );
}

export default Navbar;