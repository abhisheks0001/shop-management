import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const [success, setSuccess] = useState("");


    const availableSubCategories =
        formData.category
            ? categories[formData.category] || []
            : [];


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

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

                setError(
                    error.response?.data?.message ||
                    "Unable to load product."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [id]);


    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

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


    const handleFileChange = (e) => {
        const files = Array.from(
            e.target.files || []
        ).slice(0, 5);

        setSelectedFiles(files);

        previewUrls.forEach((url) => {
            URL.revokeObjectURL(url);
        });

        const urls = files.map(
            (file) => URL.createObjectURL(file)
        );

        setPreviewUrls(urls);

        if (files.length > 0) {
            setReplaceImages(true);
        }
    };


    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [previewUrls]);


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

        return response.data.imageUrls || [];
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");
            setSuccess("");

            let newImageUrls;

            if (
                replaceImages &&
                selectedFiles.length > 0
            ) {
                setUploading(true);

                newImageUrls =
                    await uploadImages();

                setUploading(false);
            }


            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                subCategory: formData.subCategory,
                brand: formData.brand,
                stockStatus: formData.stockStatus,
                featured: formData.featured
            };


            /*
                VERY IMPORTANT:

                Only send "images" when the admin
                actually selected replacement images.

                Your backend PUT route currently treats
                the presence of images as an instruction
                to delete the old Cloudinary images.
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


            setSuccess(
                "Product updated successfully."
            );


            setTimeout(() => {
                navigate(
                    "/admin/products"
                );
            }, 700);


        } catch (error) {
            console.error(
                "Product update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update product."
            );

        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <AdminLayout>

                <div className="mx-auto max-w-5xl">

                    <div className="mb-8">

                        <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-gray-200" />

                    </div>


                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

                        <div className="space-y-6">

                            <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />

                            <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />

                        </div>

                        <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </AdminLayout>
        );
    }


    return (
        <AdminLayout>

            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">

                    <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                        Products
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                        Edit Product
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update product information,
                        availability or images.
                    </p>

                </div>


                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
                        {success}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="grid gap-8 lg:grid-cols-[1fr_360px]"
                >

                    {/* LEFT */}
                    <div className="space-y-6">

                        {/* Information */}
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
                                        value={formData.name}
                                        onChange={handleChange}
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
                                        onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
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
                                        onChange={handleChange}
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


                        {/* Existing Images */}
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Product Images
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Current images are kept
                                    unless you upload replacements.
                                </p>

                            </div>


                            {!replaceImages &&
                                existingImages.length >
                                    0 && (

                                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                    {existingImages.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <div
                                                key={`${image}-${index}`}
                                                className="overflow-hidden rounded-xl border border-gray-200"
                                            >

                                                <img
                                                    src={image}
                                                    alt={`Existing ${
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


                            {existingImages.length ===
                                0 &&
                                !replaceImages && (

                                <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500">
                                    No existing images.
                                </div>

                            )}


                            <div className="mt-6">

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-9 text-center transition hover:border-pink-400 hover:bg-pink-50">

                                    <span className="text-3xl">
                                        📷
                                    </span>

                                    <span className="mt-3 font-semibold text-gray-900">
                                        Replace images
                                    </span>

                                    <span className="mt-1 text-sm text-gray-500">
                                        Select up to 5 new
                                        images
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

                            </div>


                            {previewUrls.length > 0 && (

                                <>
                                    <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">

                                        These new images will
                                        replace the current
                                        product images when
                                        you save.

                                    </div>


                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">

                                        {previewUrls.map(
                                            (
                                                image,
                                                index
                                            ) => (

                                                <div
                                                    key={`${image}-${index}`}
                                                    className="overflow-hidden rounded-xl border border-pink-200"
                                                >

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`Replacement ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="aspect-square w-full object-cover"
                                                    />

                                                </div>

                                            )
                                        )}

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            previewUrls.forEach(
                                                (url) =>
                                                    URL.revokeObjectURL(
                                                        url
                                                    )
                                            );

                                            setSelectedFiles(
                                                []
                                            );

                                            setPreviewUrls(
                                                []
                                            );

                                            setReplaceImages(
                                                false
                                            );
                                        }}
                                        className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700"
                                    >
                                        Cancel image replacement
                                    </button>

                                </>

                            )}

                        </section>

                    </div>


                    {/* RIGHT */}
                    <div className="space-y-6">

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
                                    onChange={handleChange}
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
                                        Highlight this product
                                        on the home page.
                                    </p>

                                </div>


                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={
                                        formData.featured
                                    }
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-pink-600"
                                />

                            </label>

                        </section>


                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            {uploading && (
                                <div className="mb-4 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                                    Uploading replacement
                                    images...
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-gray-900 px-5 py-3.5 font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting
                                    ? uploading
                                        ? "Uploading Images..."
                                        : "Saving Changes..."
                                    : "Save Changes"}
                            </button>


                            <button
                                type="button"
                                disabled={submitting}
                                onClick={() =>
                                    navigate(
                                        "/admin/products"
                                    )
                                }
                                className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
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

export default EditProduct;