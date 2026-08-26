import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../api/api";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLogin() {
    const navigate = useNavigate();

    const {
        admin,
        setAdmin,
        adminLoading
    } = useAdminAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // If admin is already logged in,
    // don't show the login page again
    useEffect(() => {
        if (!adminLoading && admin) {
            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );
        }
    }, [
        admin,
        adminLoading,
        navigate
    ]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/admin/login",
                {
                    email,
                    password
                }
            );

            // Save logged-in admin globally
            setAdmin(
                response.data.admin
            );

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {
            console.error(
                "Admin login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );

        } finally {
            setLoading(false);
        }
    };


    // Context is still checking /admin/me
    if (adminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-pink-500" />

                    <p className="mt-4 text-sm text-gray-400">
                        Checking admin session...
                    </p>

                </div>

            </div>
        );
    }


    return (
        <div className="grid min-h-screen bg-gray-950 lg:grid-cols-2">

            {/* =========================
                LEFT BRANDING SECTION
            ========================== */}

            <section className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">

                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-pink-950" />

                {/* Decorative Blur */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />

                <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />


                <div className="relative z-10 max-w-xl px-12 text-white">

                    {/* Brand */}
                    <Link
                        to="/"
                        className="text-3xl font-bold"
                    >
                        Shop
                        <span className="text-pink-500">
                            Nest
                        </span>
                    </Link>


                    <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-pink-400">
                        Administration
                    </p>


                    <h1 className="mt-5 text-5xl font-bold leading-tight">
                        Manage your shop from one place.
                    </h1>


                    <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
                        Manage products, categories,
                        product images and shop activity
                        through your secure administrator
                        dashboard.
                    </p>


                    {/* Feature Cards */}
                    <div className="mt-12 grid grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                📦
                            </div>

                            <h3 className="mt-4 font-bold">
                                Products
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                Add, edit and manage shop
                                products.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                🖼️
                            </div>

                            <h3 className="mt-4 font-bold">
                                Images
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                Upload and manage product
                                images with Cloudinary.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                📊
                            </div>

                            <h3 className="mt-4 font-bold">
                                Analytics
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                Monitor visitors, customers
                                and product activity.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                🔐
                            </div>

                            <h3 className="mt-4 font-bold">
                                Secure
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                                Protected administrator
                                operations using JWT.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                    LOGIN SECTION
            ========================== */}

            <section className="relative flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-8">

                <div className="w-full max-w-md">

                    {/* Mobile Brand */}
                    <div className="mb-10 lg:hidden">

                        <Link
                            to="/"
                            className="text-3xl font-bold text-gray-900"
                        >
                            Shop
                            <span className="text-pink-600">
                                Nest
                            </span>
                        </Link>

                    </div>


                    {/* Heading */}
                    <div className="mb-8">

                        <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
                            Admin Portal
                        </p>

                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-3 text-gray-500">
                            Sign in with your administrator
                            credentials to continue.
                        </p>

                    </div>


                    {/* Login Card */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl sm:p-8"
                    >

                        {/* Error */}
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                                <p className="text-sm font-semibold text-red-700">
                                    Login failed
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>

                            </div>
                        )}


                        {/* Email */}
                        <div>

                            <label
                                htmlFor="admin-email"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Email address
                            </label>

                            <input
                                id="admin-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="admin@example.com"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                            />

                        </div>


                        {/* Password */}
                        <div className="mt-5">

                            <label
                                htmlFor="admin-password"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>


                            <div className="relative">

                                <input
                                    id="admin-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) =>
                                                !current
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 transition hover:text-gray-900"
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading ? (
                                <>
                                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}

                        </button>

                    </form>


                    {/* Security text */}
                    <div className="mt-7 flex items-center justify-center gap-2 text-sm text-gray-400">

                        <span>
                            🔒
                        </span>

                        <span>
                            Restricted to authorized
                            administrators.
                        </span>

                    </div>


                    {/* Back */}
                    <div className="mt-4 text-center">

                        <Link
                            to="/"
                            className="text-sm font-semibold text-gray-500 transition hover:text-pink-600"
                        >
                            ← Back to shop
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default AdminLogin;