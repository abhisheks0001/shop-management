import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";
import categories from "../../config/categories";

function AddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        brand: "",
        stockStatus: "in-stock",
        featured: false
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const availableSubCategories =
        formData.category
            ? categories[formData.category] || []
            : [];


    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));


        if (name === "category") {
            setFormData((current) => ({
                ...current,
                category: value,
                subCategory: ""
            }));
        }
    };


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const limitedFiles = files.slice(0, 5);

        setSelectedFiles(limitedFiles);

        const urls = limitedFiles.map(
            (file) => URL.createObjectURL(file)
        );

        setPreviewUrls(urls);
    };


    const uploadImages = async () => {
        if (selectedFiles.length === 0) {
            return [];
        }

        const data = new FormData();

        selectedFiles.forEach((file) => {
            data.append("images", file);
        });

        const response = await api.post(
            "/products/upload-image",
            data,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

        return response.data.imageUrls || [];
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setUploading(
                selectedFiles.length > 0
            );

            setError("");
            setSuccess("");


            const imageUrls =
                await uploadImages();


            setUploading(false);


            await api.post(
                "/products",
                {
                    name: formData.name,
                    description:
                        formData.description,
                    price: Number(
                        formData.price
                    ),
                    category:
                        formData.category,
                    subCategory:
                        formData.subCategory,
                    brand:
                        formData.brand,
                    images:
                        imageUrls,
                    stockStatus:
                        formData.stockStatus,
                    featured:
                        formData.featured
                }
            );


            setSuccess(
                "Product added successfully."
            );


            setTimeout(() => {
                navigate(
                    "/admin/products"
                );
            }, 800);


        } catch (error) {
            console.error(
                "Add product error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add product."
            );

        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };


    return (
        <AdminLayout>

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">

                    <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                        Products
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                        Add Product
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Add a new product to your shop catalogue.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="grid gap-8 lg:grid-cols-[1fr_360px]"
                >

                    {/* LEFT */}
                    <div className="space-y-6">

                        {/* Basic Info */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold text-gray-900">
                                Product Information
                            </h2>

                            <div className="mt-6 space-y-5">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Lakme Face Wash"
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="5"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe the product..."
                                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>


                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            min="0"
                                            required
                                            value={
                                                formData.price
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="299"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                        />

                                    </div>


                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Brand
                                        </label>

                                        <input
                                            type="text"
                                            name="brand"
                                            value={
                                                formData.brand
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Lakme"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* Category */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-xl font-bold text-gray-900">
                                Category
                            </h2>


                            <div className="mt-6 grid gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        required
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                                    >

                                        <option value="">
                                            Select Category
                                        </option>

                                        {Object.keys(
                                            categories
                                        ).map(
                                            (
                                                category
                                            ) => (

                                                <option
                                                    key={
                                                        category
                                                    }
                                                    value={
                                                        category
                                                    }
                                                >
                                                    {
                                                        category
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Subcategory
                                    </label>

                                    <select
                                        name="subCategory"
                                        required
                                        disabled={
                                            !formData.category
                                        }
                                        value={
                                            formData.subCategory
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500 disabled:bg-gray-100"
                                    >

                                        <option value="">
                                            Select Subcategory
                                        </option>

                                        {availableSubCategories.map(
                                            (
                                                subCategory
                                            ) => (

                                                <option
                                                    key={
                                                        subCategory
                                                    }
                                                    value={
                                                        subCategory
                                                    }
                                                >
                                                    {
                                                        subCategory
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                        </section>


                        {/* Images */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Product Images
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload up to 5 images.
                                    </p>

                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                    {
                                        selectedFiles.length
                                    }
                                    /5
                                </span>

                            </div>


                            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-pink-400 hover:bg-pink-50">

                                <span className="text-3xl">
                                    📷
                                </span>

                                <span className="mt-3 font-semibold text-gray-900">
                                    Select product images
                                </span>

                                <span className="mt-1 text-sm text-gray-500">
                                    Camera or gallery
                                </span>


                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    capture="environment"
                                    onChange={
                                        handleFileChange
                                    }
                                    className="hidden"
                                />

                            </label>


                            {previewUrls.length >
                                0 && (

                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                    {previewUrls.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    image
                                                }
                                                className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                                            >

                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={`Preview ${
                                                        index +
                                                        1
                                                    }`}
                                                    className="aspect-square w-full object-cover"
                                                />

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </section>

                    </div>


                    {/* RIGHT */}
                    <div className="space-y-6">

                        {/* Status */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-gray-900">
                                Product Status
                            </h2>


                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Availability
                                </label>

                                <select
                                    name="stockStatus"
                                    value={
                                        formData.stockStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
                                >

                                    <option value="in-stock">
                                        In Stock
                                    </option>

                                    <option value="out-of-stock">
                                        Out of Stock
                                    </option>

                                </select>

                            </div>


                            <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4">

                                <div>

                                    <p className="font-semibold text-gray-900">
                                        Featured Product
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Show prominently on
                                        the home page.
                                    </p>

                                </div>

                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={
                                        formData.featured
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-5 w-5 accent-pink-600"
                                />

                            </label>

                        </section>


                        {/* Error */}
                        {error && (

                            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

                                <p className="font-semibold text-red-700">
                                    Unable to add product
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* Success */}
                        {success && (

                            <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
                                {success}
                            </div>

                        )}


                        {/* Submit */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            {uploading && (

                                <div className="mb-4 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                                    Uploading images to
                                    Cloudinary...
                                </div>

                            )}


                            <button
                                type="submit"
                                disabled={
                                    submitting
                                }
                                className="w-full rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {submitting
                                    ? uploading
                                        ? "Uploading Images..."
                                        : "Creating Product..."
                                    : "Add Product"}

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/admin/products"
                                    )
                                }
                                disabled={
                                    submitting
                                }
                                className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                        </section>

                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}

export default AddProduct;