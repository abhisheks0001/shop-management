import { useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function CustomerLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCustomer } = useCustomerAuth();

    const returnPath =
        location.state?.from || "/products";

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [generatedCaptcha, setGeneratedCaptcha] =
        useState("");

    const [captcha, setCaptcha] = useState("");

    const [captchaGenerated, setCaptchaGenerated] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateCaptcha = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/customer/login/start",
                {
                    name,
                    phone
                }
            );

            setGeneratedCaptcha(
                response.data.captcha
            );

            setCaptchaGenerated(true);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to generate CAPTCHA"
            );

        } finally {
            setLoading(false);
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/customer/login/verify",
                {
                    name,
                    phone,
                    captcha
                }
            );

            setCustomer(response.data.customer);

            navigate(returnPath, {
                replace: true
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomerLayout>

            <section className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-12">

                <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

                    <div className="text-center">

                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                            🛍️
                        </span>

                        <h1 className="mt-5 text-3xl font-bold text-gray-900">
                            Customer Login
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Login once to view complete product
                            details.
                        </p>

                    </div>


                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}


                    {!captchaGenerated ? (

                        <form
                            onSubmit={
                                handleGenerateCaptcha
                            }
                            className="mt-8 space-y-5"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    required
                                    maxLength="10"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(
                                            e.target.value
                                        )
                                    }
                                    placeholder="10-digit phone number"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:opacity-50"
                            >
                                {loading
                                    ? "Generating..."
                                    : "Continue"}
                            </button>

                        </form>

                    ) : (

                        <form
                            onSubmit={handleLogin}
                            className="mt-8 space-y-5"
                        >

                            <div className="rounded-2xl border border-dashed border-pink-300 bg-pink-50 p-6 text-center">

                                <p className="text-xs font-semibold uppercase tracking-widest text-pink-600">
                                    CAPTCHA
                                </p>

                                <p className="mt-2 select-none text-4xl font-bold tracking-[0.35em] text-gray-900">
                                    {generatedCaptcha}
                                </p>

                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Enter CAPTCHA
                                </label>

                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={captcha}
                                    onChange={(e) =>
                                        setCaptcha(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter 6-digit CAPTCHA"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.25em] outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                />
                            </div>


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:opacity-50"
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login & Continue"}
                            </button>


                            <button
                                type="button"
                                onClick={() => {
                                    setCaptchaGenerated(
                                        false
                                    );
                                    setCaptcha("");
                                    setGeneratedCaptcha("");
                                    setError("");
                                }}
                                className="w-full text-sm font-semibold text-gray-500 hover:text-pink-600"
                            >
                                Change phone number
                            </button>

                        </form>

                    )}

                </div>

            </section>

        </CustomerLayout>
    );
}

export default CustomerLogin;