import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";
import categories from "../../config/categories";

function EditProduct() {
    const { id } = useParams();
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

    const [existingImages, setExistingImages] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [replaceImages, setReplaceImages] = useState(false);

    const [error, setError] = useState("");

    const availableSubCategories =
        formData.category
            ? categories[formData.category] || []
            : [];


    // ============================================
    // FETCH EXISTING PRODUCT
    // ============================================

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                /*
                    Important:
                    Admin uses a separate protected backend route:

                    GET /api/products/admin/:id
                */

                const response = await api.get(
                    `/products/admin/${id}`
                );

                const product = response.data.product;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price ?? "",
                    category: product.category || "",
                    subCategory: product.subCategory || "",
                    brand: product.brand || "",
                    stockStatus:
                        product.stockStatus || "in-stock",
                    featured: Boolean(product.featured)
                });

                setExistingImages(
                    product.images || []
                );

            } catch (error) {
                console.error(
                    "Failed to load product:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Unable to load product.";

                setError(message);

                toast.error(message);

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [id]);


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

        /*
            If category changes,
            clear the old subcategory.
        */

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

        /*
            Backend allows maximum 5 images.
        */

        const limitedFiles =
            files.slice(0, 5);

        if (files.length > 5) {
            toast.error(
                "Maximum 5 images are allowed"
            );
        }

        /*
            Delete previous browser preview URLs.
        */

        previewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        const newPreviewUrls =
            limitedFiles.map(
                (file) =>
                    URL.createObjectURL(file)
            );

        setSelectedFiles(limitedFiles);
        setPreviewUrls(newPreviewUrls);

        if (limitedFiles.length > 0) {
            setReplaceImages(true);
        }
    };


    // ============================================
    // CLEAN PREVIEW URLS
    // ============================================

    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [previewUrls]);


    // ============================================
    // CANCEL IMAGE REPLACEMENT
    // ============================================

    const handleCancelImageReplacement = () => {
        previewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        setSelectedFiles([]);
        setPreviewUrls([]);
        setReplaceImages(false);

        toast.success(
            "Existing images will be kept"
        );
    };


    // ============================================
    // UPLOAD NEW IMAGES
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
    // SUBMIT UPDATE
    // ============================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            /*
                Basic frontend validation
            */

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


            let newImageUrls;


            // ====================================
            // UPLOAD REPLACEMENT IMAGES
            // ====================================

            if (
                replaceImages &&
                selectedFiles.length > 0
            ) {
                try {
                    setUploading(true);

                    newImageUrls =
                        await uploadImages();

                } finally {
                    setUploading(false);
                }
            }


            // ====================================
            // PRODUCT UPDATE PAYLOAD
            // ====================================

            const payload = {
                name:
                    formData.name.trim(),

                description:
                    formData.description.trim(),

                price:
                    Number(formData.price),

                category:
                    formData.category,

                subCategory:
                    formData.subCategory,

                brand:
                    formData.brand.trim(),

                stockStatus:
                    formData.stockStatus,

                featured:
                    formData.featured
            };


            /*
                IMPORTANT:

                Don't send images unless new ones
                were actually selected.

                Your backend checks the presence of
                images to determine whether the old
                Cloudinary images should be removed.
            */

            if (
                replaceImages &&
                newImageUrls
            ) {
                payload.images =
                    newImageUrls;
            }


            await api.put(
                `/products/${id}`,
                payload
            );


            toast.success(
                "Product updated successfully"
            );


            navigate(
                "/admin/products",
                {
                    replace: true
                }
            );


        } catch (error) {
            console.error(
                "Product update error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to update product.";

            setError(message);

            toast.error(message);

        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };


    // ============================================
    // LOADING SCREEN
    // ============================================

    if (loading) {
        return (
            <AdminLayout>

                <div className="mx-auto max-w-5xl">

                    <div className="mb-8">

                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />

                    </div>


                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

                        <div className="space-y-6">

                            <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />

                            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />

                            <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />

                        </div>


                        <div className="space-y-6">

                            <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />

                            <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />

                        </div>

                    </div>

                </div>

            </AdminLayout>
        );
    }


    // ============================================
    // PAGE
    // ============================================

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
                            Edit Product
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Update product information,
                            availability and images.
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
                            Something went wrong
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


                        {/* PRODUCT INFORMATION */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Product Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Basic information visible
                                    to customers.
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
                                    Choose the correct category
                                    and subcategory.
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
                                            (category) => (

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
                                        Existing images stay
                                        unchanged unless you
                                        upload replacements.
                                    </p>

                                </div>


                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">

                                    {replaceImages
                                        ? selectedFiles.length
                                        : existingImages.length}

                                    /5 images

                                </span>


                            </div>



                            {/* EXISTING IMAGES */}

                            {!replaceImages &&
                                existingImages.length >
                                    0 && (

                                <div className="mt-6">


                                    <p className="mb-3 text-sm font-semibold text-gray-700">
                                        Current Images
                                    </p>


                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                        {existingImages.map(
                                            (
                                                image,
                                                index
                                            ) => (

                                                <div
                                                    key={`${image}-${index}`}
                                                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                                                >

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`Existing product ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="aspect-square w-full object-cover transition group-hover:scale-105"
                                                    />


                                                    {index ===
                                                        0 && (

                                                        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                                                            Main
                                                        </span>

                                                    )}

                                                </div>

                                            )
                                        )}

                                    </div>


                                </div>

                            )}



                            {/* NO IMAGES */}

                            {!replaceImages &&
                                existingImages.length ===
                                    0 && (

                                <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">

                                    <div className="text-3xl">
                                        🖼️
                                    </div>

                                    <p className="mt-3 font-semibold text-gray-700">
                                        No current images
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload images below
                                        to add product images.
                                    </p>

                                </div>

                            )}



                            {/* FILE SELECTOR */}

                            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-pink-400 hover:bg-pink-50">

                                <span className="text-3xl">
                                    📷
                                </span>


                                <span className="mt-3 font-semibold text-gray-900">

                                    {existingImages.length >
                                    0
                                        ? "Replace product images"
                                        : "Add product images"}

                                </span>


                                <span className="mt-1 text-sm text-gray-500">
                                    Select up to 5 images
                                    from your device
                                </span>


                                <span className="mt-1 text-xs text-gray-400">
                                    JPG, PNG, WEBP • Maximum
                                    5MB each
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



                            {/* NEW IMAGE WARNING */}

                            {replaceImages &&
                                previewUrls.length >
                                    0 && (

                                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">

                                    <p className="text-sm font-semibold text-orange-700">
                                        Image replacement
                                    </p>

                                    <p className="mt-1 text-sm text-orange-600">
                                        Saving this product
                                        will replace all
                                        current images with
                                        these new images.
                                    </p>

                                </div>

                            )}



                            {/* PREVIEWS */}

                            {previewUrls.length >
                                0 && (

                                <div className="mt-5">

                                    <p className="mb-3 text-sm font-semibold text-gray-700">
                                        New Images
                                    </p>


                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                        {previewUrls.map(
                                            (
                                                image,
                                                index
                                            ) => (

                                                <div
                                                    key={`${image}-${index}`}
                                                    className="relative overflow-hidden rounded-xl border border-pink-200 bg-gray-100"
                                                >

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`New product ${
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


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancelImageReplacement
                                        }
                                        className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                    >
                                        Cancel Image Replacement
                                    </button>


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
                                        Display prominently
                                        on the customer home
                                        page.
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



                        {/* PRODUCT SUMMARY */}

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

                                        {replaceImages
                                            ? selectedFiles.length
                                            : existingImages.length}

                                    </span>

                                </div>


                            </div>


                        </section>



                        {/* SAVE */}

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
                                                Please don't
                                                close this page.
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
                                            : "Saving Changes..."}

                                    </>

                                ) : (

                                    "Save Changes"

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
                                Changes will immediately
                                appear on the customer-facing
                                shop.
                            </p>


                        </section>


                    </div>


                </form>


            </div>

        </AdminLayout>
    );
}

export default EditProduct;