import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

    const availableSubCategories =
        formData.category
            ? categories[formData.category] || []
            : [];

    // ============================================
    // FORM CHANGE
    // ============================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        // If category changes,
        // reset old subcategory
        if (name === "category") {
            setFormData((current) => ({
                ...current,
                category: value,
                subCategory: ""
            }));

            return;
        }

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    // ============================================
    // IMAGE SELECTION
    // ============================================

    const handleFileChange = (e) => {
        const files = Array.from(
            e.target.files || []
        );

        const limitedFiles =
            files.slice(0, 5);

        if (files.length > 5) {
            toast.error(
                "Maximum 5 images are allowed"
            );
        }

        // Remove previous browser preview URLs
        previewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        const urls = limitedFiles.map(
            (file) =>
                URL.createObjectURL(file)
        );

        setSelectedFiles(limitedFiles);
        setPreviewUrls(urls);
    };

    // ============================================
    // CLEANUP PREVIEW URLS
    // ============================================

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [previewUrls]);

    // ============================================
    // REMOVE ALL SELECTED IMAGES
    // ============================================

    const handleClearImages = () => {
        previewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        setSelectedFiles([]);
        setPreviewUrls([]);

        toast.success(
            "Selected images removed"
        );
    };

    // ============================================
    // UPLOAD IMAGES TO CLOUDINARY
    // ============================================

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
            data
        );

        return (
            response.data.imageUrls || []
        );
    };

    // ============================================
    // SUBMIT PRODUCT
    // ============================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            // Basic validation
            if (!formData.name.trim()) {
                toast.error(
                    "Product name is required"
                );
                return;
            }

            if (!formData.category) {
                toast.error(
                    "Category is required"
                );
                return;
            }

            if (!formData.subCategory) {
                toast.error(
                    "Subcategory is required"
                );
                return;
            }

            if (
                formData.price === "" ||
                Number(formData.price) < 0
            ) {
                toast.error(
                    "Enter a valid product price"
                );
                return;
            }

            let imageUrls = [];

            // Upload selected images first
            if (selectedFiles.length > 0) {
                try {
                    setUploading(true);

                    imageUrls =
                        await uploadImages();

                } finally {
                    setUploading(false);
                }
            }

            // Create product
            await api.post(
                "/products",
                {
                    name:
                        formData.name.trim(),

                    description:
                        formData.description.trim(),

                    price:
                        Number(
                            formData.price
                        ),

                    category:
                        formData.category,

                    subCategory:
                        formData.subCategory,

                    brand:
                        formData.brand.trim(),

                    images:
                        imageUrls,

                    stockStatus:
                        formData.stockStatus,

                    featured:
                        formData.featured
                }
            );

            toast.success(
                "Product added successfully"
            );

            navigate(
                "/admin/products",
                {
                    replace: true
                }
            );

        } catch (error) {
            console.error(
                "Add product error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to add product.";

            setError(message);

            toast.error(message);

        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>

            <div className="mx-auto max-w-5xl">

                {/* =================================
                        HEADER
                ================================= */}

                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                            Products
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                            Add Product
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Add a new product to your shop
                            catalogue.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        ← Back to Products
                    </button>

                </div>

                {/* =================================
                        ERROR
                ================================= */}

                {error && (

                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <p className="font-semibold text-red-700">
                            Unable to create product
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>

                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-8 lg:grid-cols-[1fr_360px]"
                >

                    {/* =================================
                           LEFT COLUMN
                    ================================= */}

                    <div className="space-y-6">

                        {/* PRODUCT INFO */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Product Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Information visible to
                                    customers.
                                </p>

                            </div>

                            <div className="mt-6 space-y-5">

                                {/* NAME */}

                                <div>

                                    <label
                                        htmlFor="product-name"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Product Name
                                    </label>

                                    <input
                                        id="product-name"
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
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div>

                                    <label
                                        htmlFor="product-description"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="product-description"
                                        name="description"
                                        rows="5"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Describe the product..."
                                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                    />

                                </div>

                                <div className="grid gap-5 md:grid-cols-2">

                                    {/* PRICE */}

                                    <div>

                                        <label
                                            htmlFor="product-price"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Price
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                                                ₹
                                            </span>

                                            <input
                                                id="product-price"
                                                type="number"
                                                name="price"
                                                min="0"
                                                step="0.01"
                                                required
                                                value={
                                                    formData.price
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="299"
                                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-9 pr-4 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                            />

                                        </div>

                                    </div>

                                    {/* BRAND */}

                                    <div>

                                        <label
                                            htmlFor="product-brand"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Brand
                                        </label>

                                        <input
                                            id="product-brand"
                                            type="text"
                                            name="brand"
                                            value={
                                                formData.brand
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Lakme"
                                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* =================================
                              CATEGORY
                        ================================= */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Category
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Select the correct product
                                    category and subcategory.
                                </p>

                            </div>

                            <div className="mt-6 grid gap-5 md:grid-cols-2">

                                {/* CATEGORY */}

                                <div>

                                    <label
                                        htmlFor="product-category"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="product-category"
                                        name="category"
                                        required
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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

                                {/* SUBCATEGORY */}

                                <div>

                                    <label
                                        htmlFor="product-subcategory"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Subcategory
                                    </label>

                                    <select
                                        id="product-subcategory"
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
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-100"
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

                        {/* =================================
                            PRODUCT IMAGES
                        ================================= */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div className="flex flex-wrap items-start justify-between gap-4">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Product Images
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload up to 5 product
                                        images.
                                    </p>

                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">

                                    {
                                        selectedFiles.length
                                    }
                                    /5 images

                                </span>

                            </div>

                            {/* FILE PICKER */}

                            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-pink-400 hover:bg-pink-50">

                                <span className="text-3xl">
                                    📷
                                </span>

                                <span className="mt-3 font-semibold text-gray-900">
                                    Select product images
                                </span>

                                <span className="mt-1 text-sm text-gray-500">
                                    Choose from camera,
                                    gallery or files
                                </span>

                                <span className="mt-1 text-xs text-gray-400">
                                    Maximum 5 images • 5MB
                                    each
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

                            {/* PREVIEWS */}

                            {previewUrls.length > 0 && (

                                <div className="mt-6">

                                    <div className="mb-3 flex items-center justify-between">

                                        <p className="text-sm font-semibold text-gray-700">
                                            Selected Images
                                        </p>

                                        <button
                                            type="button"
                                            onClick={
                                                handleClearImages
                                            }
                                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                                        >
                                            Remove All
                                        </button>

                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                        {previewUrls.map(
                                            (
                                                image,
                                                index
                                            ) => (

                                                <div
                                                    key={`${image}-${index}`}
                                                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                                                >

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`Product preview ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="aspect-square w-full object-cover"
                                                    />

                                                    {index ===
                                                        0 && (

                                                        <span className="absolute bottom-2 left-2 rounded-full bg-pink-600 px-2 py-1 text-[10px] font-semibold text-white">
                                                            Main
                                                        </span>

                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                        </section>

                    </div>

                    {/* =================================
                          RIGHT COLUMN
                    ================================= */}

                    <div className="space-y-6">

                        {/* STATUS */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-gray-900">
                                Product Status
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Control availability and
                                homepage visibility.
                            </p>

                            {/* STOCK */}

                            <div className="mt-6">

                                <label
                                    htmlFor="product-stock"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Availability
                                </label>

                                <select
                                    id="product-stock"
                                    name="stockStatus"
                                    value={
                                        formData.stockStatus
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                                >

                                    <option value="in-stock">
                                        In Stock
                                    </option>

                                    <option value="out-of-stock">
                                        Out of Stock
                                    </option>

                                </select>

                            </div>

                            {/* FEATURED */}

                            <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100">

                                <div>

                                    <p className="font-semibold text-gray-900">
                                        Featured Product
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Show this product
                                        prominently on the
                                        customer home page.
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
                                    className="h-5 w-5 shrink-0 accent-pink-600"
                                />

                            </label>

                        </section>

                        {/* SUMMARY */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-gray-900">
                                Summary
                            </h2>

                            <div className="mt-5 space-y-4 text-sm">

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">
                                        Product
                                    </span>

                                    <span className="max-w-40 truncate font-semibold text-gray-900">
                                        {formData.name ||
                                            "—"}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">
                                        Price
                                    </span>

                                    <span className="font-semibold text-gray-900">

                                        {formData.price !==
                                        ""
                                            ? `₹${formData.price}`
                                            : "—"}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">
                                        Category
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        {formData.category ||
                                            "—"}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">
                                        Subcategory
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        {formData.subCategory ||
                                            "—"}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">
                                        Images
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        {
                                            selectedFiles.length
                                        }
                                    </span>

                                </div>

                            </div>

                        </section>

                        {/* SUBMIT */}

                        <section className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            {uploading && (

                                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

                                        <div>

                                            <p className="text-sm font-semibold text-blue-700">
                                                Uploading images
                                            </p>

                                            <p className="mt-1 text-xs text-blue-500">
                                                Uploading to
                                                Cloudinary...
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}

                            <button
                                type="submit"
                                disabled={
                                    submitting
                                }
                                className="flex w-full items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {submitting ? (

                                    <>

                                        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                        {uploading
                                            ? "Uploading Images..."
                                            : "Creating Product..."}

                                    </>

                                ) : (

                                    "Add Product"

                                )}

                            </button>

                            <button
                                type="button"
                                disabled={
                                    submitting
                                }
                                onClick={() =>
                                    navigate(
                                        "/admin/products"
                                    )
                                }
                                className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                                Once created, the product will
                                immediately be available to
                                customers.
                            </p>

                        </section>

                    </div>

                </form>

            </div>

        </AdminLayout>
    );
}

export default AddProduct;