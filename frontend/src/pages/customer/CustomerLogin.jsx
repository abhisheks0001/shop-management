import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function CustomerLogin() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        customer,
        setCustomer
    } = useCustomerAuth();

    /*
        If user came from a protected product page:

        /product/:id
            ↓
        401
            ↓
        /login

        We remember the original page here.
    */

    const returnPath =
        location.state?.from ||
        "/products";


    // ============================================
    // FORM STATE
    // ============================================

    const [name, setName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [captcha, setCaptcha] =
        useState("");

    const [
        generatedCaptcha,
        setGeneratedCaptcha
    ] = useState("");

    const [
        captchaGenerated,
        setCaptchaGenerated
    ] = useState(false);


    // ============================================
    // UI STATE
    // ============================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ============================================
    // PHONE VALIDATION
    // ============================================

    const validatePhone = () => {
        const cleanPhone =
            phone.trim();

        if (!/^\d{10}$/.test(cleanPhone)) {

            toast.error(
                "Enter a valid 10-digit phone number"
            );

            return false;
        }

        return true;
    };


    // ============================================
    // GENERATE CAPTCHA
    // ============================================

    const handleGenerateCaptcha =
        async (e) => {

        e.preventDefault();


        if (!name.trim()) {

            toast.error(
                "Please enter your name"
            );

            return;
        }


        if (!validatePhone()) {
            return;
        }


        try {

            setLoading(true);
            setError("");


            /*
                Use the exact route you created
                in your backend.

                Expected:
                POST /api/customer/login/start

                {
                    name,
                    phone
                }
            */

            const response =
                await api.post(
                    "/customer/login/start",
                    {
                        name:
                            name.trim(),

                        phone:
                            phone.trim()
                    }
                );


            setGeneratedCaptcha(
                String(
                    response.data.captcha ||
                    ""
                )
            );


            setCaptcha("");

            setCaptchaGenerated(
                true
            );


            toast.success(
                "CAPTCHA generated"
            );


        } catch (error) {

            console.error(
                "CAPTCHA generation error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to generate CAPTCHA.";


            setError(message);

            toast.error(message);


        } finally {

            setLoading(false);

        }

    };


    // ============================================
    // VERIFY + LOGIN
    // ============================================

    const handleLogin =
        async (e) => {

        e.preventDefault();


        if (!captcha.trim()) {

            toast.error(
                "Enter the CAPTCHA"
            );

            return;
        }


        if (
            !/^\d{6}$/.test(
                captcha.trim()
            )
        ) {

            toast.error(
                "CAPTCHA must contain 6 digits"
            );

            return;
        }


        try {

            setLoading(true);
            setError("");


            const response =
                await api.post(
                    "/customer/login/verify",
                    {
                        name:
                            name.trim(),

                        phone:
                            phone.trim(),

                        captcha:
                            captcha.trim()
                    }
                );


            /*
                Backend response expected:

                {
                    message:
                        "Customer login successful",

                    customer: {
                        id: "...",
                        name: "...",
                        phone: "..."
                    }
                }
            */

            setCustomer(
                response.data.customer
            );


            toast.success(
                `Welcome ${
                    response.data.customer
                        ?.name || name
                }`
            );


            /*
                Customer originally clicked
                a protected product?

                Return there.

                Otherwise go to products.
            */

            navigate(
                returnPath,
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "Customer login error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Customer login failed.";


            setError(message);

            toast.error(message);


        } finally {

            setLoading(false);

        }

    };


    // ============================================
    // RESET CAPTCHA
    // ============================================

    const handleReset = () => {

        setCaptchaGenerated(
            false
        );

        setGeneratedCaptcha("");

        setCaptcha("");

        setError("");

    };


    // ============================================
    // ALREADY LOGGED IN
    // ============================================

    if (customer) {

        return (

            <CustomerLayout>

                <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-12">

                    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                            ✓
                        </div>


                        <h1 className="mt-5 text-2xl font-bold text-gray-900">

                            You're already logged in

                        </h1>


                        <p className="mt-2 text-gray-500">

                            Welcome back,{" "}

                            <span className="font-semibold text-gray-900">
                                {customer.name}
                            </span>

                            .

                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    returnPath
                                )
                            }
                            className="mt-7 w-full rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600"
                        >
                            Continue Shopping
                        </button>

                    </div>

                </section>

            </CustomerLayout>

        );

    }


    // ============================================
    // LOGIN PAGE
    // ============================================

    return (

        <CustomerLayout>


            <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-12">


                {/* Decorative background */}

                <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />

                <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />


                <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl md:grid-cols-2">


                    {/* =================================
                            LEFT INFO
                    ================================= */}

                    <div className="hidden bg-gradient-to-br from-gray-950 via-gray-900 to-pink-950 p-10 text-white md:block">


                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-400">
                            Customer Access
                        </p>


                        <h1 className="mt-5 text-4xl font-bold leading-tight">

                            View complete product details.

                        </h1>


                        <p className="mt-5 leading-7 text-gray-400">

                            Login once using your name,
                            phone number and CAPTCHA.
                            Your session will remain
                            active while browsing products.

                        </p>


                        <div className="mt-10 space-y-4">


                            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/20">
                                    📱
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Simple Login
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Name and phone number.
                                    </p>

                                </div>

                            </div>


                            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20">
                                    🔢
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        CAPTCHA Verification
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        6-digit verification step.
                                    </p>

                                </div>

                            </div>


                            <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/20">
                                    ✓
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Stay Logged In
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        No repeated login for each product.
                                    </p>

                                </div>

                            </div>


                        </div>


                    </div>



                    {/* =================================
                            RIGHT FORM
                    ================================= */}

                    <div className="p-6 sm:p-10">


                        <div className="mb-8">


                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                                🛍️
                            </div>


                            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-pink-600">
                                Customer Login
                            </p>


                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">

                                {captchaGenerated
                                    ? "Verify CAPTCHA"
                                    : "Welcome"}

                            </h2>


                            <p className="mt-3 leading-7 text-gray-500">

                                {captchaGenerated
                                    ? "Enter the six-digit CAPTCHA shown below to continue."
                                    : "Enter your details to access complete product information."}

                            </p>


                        </div>



                        {/* =================================
                                ERROR
                        ================================= */}

                        {error && (

                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                                <div className="flex gap-3">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                                        ⚠️
                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-red-700">
                                            Something went wrong
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-red-600">
                                            {error}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}



                        {/* =================================
                             STEP 1
                        ================================= */}

                        {!captchaGenerated ? (

                            <form
                                onSubmit={
                                    handleGenerateCaptcha
                                }
                                className="space-y-5"
                            >


                                {/* NAME */}

                                <div>

                                    <label
                                        htmlFor="customer-name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Your Name
                                    </label>

                                    <input
                                        id="customer-name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={
                                            name
                                        }
                                        onChange={(e) => {

                                            setName(
                                                e.target.value
                                            );

                                            if (error) {
                                                setError("");
                                            }

                                        }}
                                        placeholder="Enter your name"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>



                                {/* PHONE */}

                                <div>

                                    <label
                                        htmlFor="customer-phone"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Phone Number
                                    </label>


                                    <div className="flex">


                                        <div className="flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 px-4 font-semibold text-gray-500">
                                            +91
                                        </div>


                                        <input
                                            id="customer-phone"
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            required
                                            maxLength="10"
                                            value={
                                                phone
                                            }
                                            onChange={(e) => {

                                                const value =
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                        .slice(
                                                            0,
                                                            10
                                                        );

                                                setPhone(
                                                    value
                                                );

                                                if (
                                                    error
                                                ) {
                                                    setError(
                                                        ""
                                                    );
                                                }

                                            }}
                                            placeholder="9876543210"
                                            className="w-full rounded-r-xl border border-gray-300 bg-white px-4 py-3.5 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                        />


                                    </div>


                                    <p className="mt-2 text-xs text-gray-400">
                                        Enter your 10-digit
                                        Indian mobile number.
                                    </p>

                                </div>



                                {/* CONTINUE */}

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {loading ? (

                                        <>
                                            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                            Generating CAPTCHA...
                                        </>

                                    ) : (

                                        "Continue"

                                    )}

                                </button>


                            </form>


                        ) : (


                            /* =================================
                                 STEP 2
                            ================================= */

                            <form
                                onSubmit={
                                    handleLogin
                                }
                                className="space-y-5"
                            >


                                {/* USER SUMMARY */}

                                <div className="rounded-xl bg-gray-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">
                                            {name
                                                .charAt(
                                                    0
                                                )}
                                        </div>


                                        <div>

                                            <p className="font-semibold text-gray-900">
                                                {name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                +91 {phone}
                                            </p>

                                        </div>


                                    </div>

                                </div>



                                {/* CAPTCHA DISPLAY */}

                                <div className="rounded-2xl border-2 border-dashed border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 p-6 text-center">


                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-pink-600">
                                        Your CAPTCHA
                                    </p>


                                    <p className="mt-4 select-none text-4xl font-black tracking-[0.3em] text-gray-900 sm:text-5xl">

                                        {
                                            generatedCaptcha
                                        }

                                    </p>


                                    <p className="mt-4 text-xs text-gray-400">
                                        Enter this 6-digit
                                        number below.
                                    </p>


                                </div>



                                {/* CAPTCHA INPUT */}

                                <div>

                                    <label
                                        htmlFor="customer-captcha"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Enter CAPTCHA
                                    </label>


                                    <input
                                        id="customer-captcha"
                                        type="text"
                                        inputMode="numeric"
                                        required
                                        maxLength="6"
                                        autoFocus
                                        value={
                                            captcha
                                        }
                                        onChange={(e) => {

                                            const value =
                                                e.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        6
                                                    );

                                            setCaptcha(
                                                value
                                            );

                                            if (error) {
                                                setError("");
                                            }

                                        }}
                                        placeholder="000000"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-center text-2xl font-bold tracking-[0.35em] outline-none transition placeholder:tracking-[0.35em] placeholder:text-gray-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>



                                {/* VERIFY */}

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {loading ? (

                                        <>
                                            <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                            Verifying...
                                        </>

                                    ) : (

                                        "Login & Continue"

                                    )}

                                </button>



                                {/* CHANGE NUMBER */}

                                <button
                                    type="button"
                                    disabled={
                                        loading
                                    }
                                    onClick={
                                        handleReset
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                                >
                                    ← Change Details
                                </button>


                            </form>

                        )}



                        {/* =================================
                                BACK TO SHOP
                        ================================= */}

                        <div className="mt-8 border-t border-gray-100 pt-6 text-center">


                            <Link
                                to="/products"
                                className="text-sm font-semibold text-gray-500 transition hover:text-pink-600"
                            >
                                Continue browsing without
                                opening product details
                            </Link>


                        </div>


                    </div>


                </div>


            </section>


        </CustomerLayout>

    );

}

export default CustomerLogin;