import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/api";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLogin() {
    const navigate = useNavigate();

    const {
        admin,
        setAdmin,
        adminLoading
    } = useAdminAuth();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ============================================
    // REDIRECT IF ALREADY LOGGED IN
    // ============================================

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


    // ============================================
    // LOGIN SUBMIT
    // ============================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");


            // Basic validation

            if (!email.trim()) {
                toast.error(
                    "Email is required"
                );

                return;
            }

            if (!password) {
                toast.error(
                    "Password is required"
                );

                return;
            }


            const response = await api.post(
                "/admin/login",
                {
                    email:
                        email.trim(),
                    password
                }
            );


            /*
                Backend response expected:

                {
                    message: "Admin login successful",
                    admin: {
                        id: "...",
                        name: "...",
                        email: "...",
                        role: "admin"
                    }
                }
            */

            setAdmin(
                response.data.admin
            );


            toast.success(
                `Welcome ${
                    response.data.admin?.name ||
                    "Admin"
                }`
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


            const message =
                error.response?.data?.message ||
                "Unable to login. Please check your credentials.";


            setError(message);

            toast.error(message);


        } finally {
            setLoading(false);
        }
    };


    // ============================================
    // AUTH CHECK LOADING
    // ============================================

    if (adminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950">

                <div className="text-center">

                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-700 border-t-pink-500" />

                    <p className="mt-4 text-sm font-medium text-gray-400">
                        Checking admin session...
                    </p>

                </div>

            </div>
        );
    }


    // ============================================
    // PAGE
    // ============================================

    return (
        <div className="grid min-h-screen bg-gray-950 lg:grid-cols-2">

            {/* =================================
                    LEFT BRANDING
            ================================= */}

            <section className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center">

                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-pink-950" />


                {/* Decorative background elements */}
                <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-pink-600/10 blur-3xl" />

                <div className="absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-3xl" />


                <div className="relative z-10 max-w-xl px-12 text-white">

                    {/* Brand */}

                    <Link
                        to="/"
                        className="inline-block text-3xl font-bold tracking-tight"
                    >
                        Shop
                        <span className="text-pink-500">
                            Nest
                        </span>
                    </Link>


                    <p className="mt-12 text-sm font-bold uppercase tracking-[0.25em] text-pink-400">
                        Administration Portal
                    </p>


                    <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
                        Manage your shop from one secure dashboard.
                    </h1>


                    <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
                        Manage products, images, categories,
                        availability and shop activity from
                        one place.
                    </p>


                    {/* Feature cards */}

                    <div className="mt-12 grid grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                📦
                            </div>

                            <h3 className="mt-4 font-bold">
                                Product Management
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Add, edit and safely remove
                                shop products.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                🖼️
                            </div>

                            <h3 className="mt-4 font-bold">
                                Image Management
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Upload and replace product
                                images using Cloudinary.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                📊
                            </div>

                            <h3 className="mt-4 font-bold">
                                Analytics
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Monitor visitors, customers
                                and product activity.
                            </p>

                        </div>


                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                            <div className="text-3xl">
                                🔐
                            </div>

                            <h3 className="mt-4 font-bold">
                                Secure Access
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Protected admin operations
                                using JWT authentication.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================
                    LOGIN SECTION
            ================================= */}

            <section className="relative flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-8">

                <div className="w-full max-w-md">

                    {/* Mobile brand */}

                    <div className="mb-10 lg:hidden">

                        <Link
                            to="/"
                            className="text-3xl font-bold tracking-tight text-gray-900"
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

                        <p className="mt-3 leading-7 text-gray-500">
                            Sign in with your administrator
                            credentials to manage the shop.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl sm:p-8"
                    >

                        {/* Error */}

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                                <div className="flex gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                                        ⚠️
                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-red-700">
                                            Login failed
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-red-600">
                                            {error}
                                        </p>

                                    </div>

                                </div>

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
                                onChange={(e) => {
                                    setEmail(
                                        e.target.value
                                    );

                                    if (error) {
                                        setError("");
                                    }
                                }}
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
                                    onChange={(e) => {
                                        setPassword(
                                            e.target.value
                                        );

                                        if (error) {
                                            setError("");
                                        }
                                    }}
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


                        {/* Security note */}

                        <div className="mt-5 rounded-xl bg-gray-50 p-4">

                            <div className="flex gap-3">

                                <span>
                                    🔒
                                </span>

                                <p className="text-xs leading-5 text-gray-500">
                                    This portal is restricted to
                                    authorized shop administrators.
                                </p>

                            </div>

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-pink-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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


                    {/* Footer */}

                    <div className="mt-7 text-center">

                        <Link
                            to="/"
                            className="text-sm font-semibold text-gray-500 transition hover:text-pink-600"
                        >
                            ← Back to customer shop
                        </Link>

                    </div>


                    <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                        Admin authentication is protected using
                        HTTP-only cookies and backend authorization.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default AdminLogin;