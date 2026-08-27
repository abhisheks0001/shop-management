import 'package:flutter/material.dart';

import '../../services/product_service.dart';

class EditProductScreen extends StatefulWidget {
  final Map<String, dynamic> product;

  const EditProductScreen({
    super.key,
    required this.product,
  });

  @override
  State<EditProductScreen> createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final ProductService _productService = ProductService();

  final nameController = TextEditingController();
  final descriptionController = TextEditingController();
  final priceController = TextEditingController();
  final brandController = TextEditingController();

  final Map<String, List<String>> categories = {
    'Cosmetics': [
      'Face Care',
      'Hair Care',
      'Makeup',
      'Skin Care',
      'Body Care',
      'Fragrance',
    ],
    'General Store': [
      'Grocery',
      'Personal Care',
      'Household',
      'Stationery',
    ],
  };

  String? selectedCategory;
  String? selectedSubCategory;
  String stockStatus = 'in-stock';
  bool featured = false;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();

    nameController.text =
        widget.product['name']?.toString() ?? '';

    descriptionController.text =
        widget.product['description']?.toString() ?? '';

    priceController.text =
        widget.product['price']?.toString() ?? '';

    brandController.text =
        widget.product['brand']?.toString() ?? '';

    final category =
        widget.product['category']?.toString();

    if (category != null && categories.containsKey(category)) {
      selectedCategory = category;
    }

    final subCategory =
        widget.product['subCategory']?.toString();

    if (selectedCategory != null &&
        categories[selectedCategory!]!.contains(subCategory)) {
      selectedSubCategory = subCategory;
    }

    final currentStock =
        widget.product['stockStatus']?.toString();

    if (currentStock == 'in-stock' ||
        currentStock == 'out-of-stock') {
      stockStatus = currentStock!;
    }

    featured = widget.product['featured'] == true;
  }

  Future<void> updateProduct() async {
    if (nameController.text.trim().isEmpty ||
        descriptionController.text.trim().isEmpty ||
        priceController.text.trim().isEmpty ||
        selectedCategory == null ||
        selectedSubCategory == null) {
      _showMessage(
        'Please fill all required fields',
        isError: true,
      );
      return;
    }

    final price = double.tryParse(
      priceController.text.trim(),
    );

    if (price == null || price < 0) {
      _showMessage(
        'Please enter a valid price',
        isError: true,
      );
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final images = widget.product['images'] is List
          ? List<String>.from(
              widget.product['images'],
            )
          : <String>[];

      final productId =
          widget.product['_id']?.toString();

      if (productId == null || productId.isEmpty) {
        _showMessage(
          'Product ID not found',
          isError: true,
        );
        return;
      }

      final result =
          await _productService.updateProduct(
        id: productId,
        name: nameController.text.trim(),
        description: descriptionController.text.trim(),
        price: price,
        category: selectedCategory!,
        subCategory: selectedSubCategory!,
        brand: brandController.text.trim(),
        stockStatus: stockStatus,
        featured: featured,
        images: images,
      );

      if (!mounted) return;

      _showMessage(
        result['message'] ??
            'Product updated successfully',
      );

      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;

      _showMessage(
        'Failed to update product: $e',
        isError: true,
      );
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  void _showMessage(
    String message, {
    bool isError = false,
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        backgroundColor:
            isError ? Colors.red : Colors.green,
      ),
    );
  }

  InputDecoration _inputDecoration(
    String label,
    IconData icon,
  ) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(
          width: 2,
        ),
      ),
      filled: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    final subCategories = selectedCategory == null
        ? <String>[]
        : categories[selectedCategory!] ?? [];

    final List<dynamic> images =
        widget.product['images'] is List
            ? widget.product['images']
            : [];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Edit Product',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),

      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),

          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 650,
            ),

            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [
                // Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(22),

                  decoration: BoxDecoration(
                    borderRadius:
                        BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.grey.shade300,
                    ),
                  ),

                  child: Row(
                    children: [
                      Container(
                        width: 65,
                        height: 65,

                        decoration: BoxDecoration(
                          borderRadius:
                              BorderRadius.circular(16),
                          color:
                              Colors.grey.shade200,
                        ),

                        child: images.isNotEmpty
                            ? ClipRRect(
                                borderRadius:
                                    BorderRadius.circular(
                                  16,
                                ),
                                child: Image.network(
                                  images[0].toString(),
                                  fit: BoxFit.cover,
                                  errorBuilder:
                                      (
                                    context,
                                    error,
                                    stackTrace,
                                  ) {
                                    return const Icon(
                                      Icons
                                          .image_not_supported,
                                      size: 30,
                                    );
                                  },
                                ),
                              )
                            : const Icon(
                                Icons.inventory_2,
                                size: 32,
                              ),
                      ),

                      const SizedBox(width: 16),

                      const Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Update Product',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight:
                                    FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              'Edit your product information',
                              style: TextStyle(
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 25),

                // Product name
                TextField(
                  controller: nameController,
                  decoration: _inputDecoration(
                    'Product Name *',
                    Icons.inventory_2,
                  ),
                ),

                const SizedBox(height: 16),

                // Description
                TextField(
                  controller:
                      descriptionController,
                  maxLines: 4,
                  decoration: _inputDecoration(
                    'Description *',
                    Icons.description,
                  ),
                ),

                const SizedBox(height: 16),

                // Price
                TextField(
                  controller: priceController,
                  keyboardType:
                      const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: _inputDecoration(
                    'Price *',
                    Icons.currency_rupee,
                  ).copyWith(
                    prefixText: '₹ ',
                  ),
                ),

                const SizedBox(height: 16),

                // Brand
                TextField(
                  controller: brandController,
                  decoration: _inputDecoration(
                    'Brand',
                    Icons.branding_watermark,
                  ),
                ),

                const SizedBox(height: 16),

                // Category
                DropdownButtonFormField<String>(
                  initialValue: selectedCategory,

                  decoration: _inputDecoration(
                    'Category *',
                    Icons.category,
                  ),

                  items: categories.keys.map(
                    (category) {
                      return DropdownMenuItem<String>(
                        value: category,
                        child: Text(category),
                      );
                    },
                  ).toList(),

                  onChanged: (value) {
                    setState(() {
                      selectedCategory = value;
                      selectedSubCategory = null;
                    });
                  },
                ),

                const SizedBox(height: 16),

                // Subcategory
                DropdownButtonFormField<String>(
                  initialValue:
                      selectedSubCategory,

                  decoration: _inputDecoration(
                    'Subcategory *',
                    Icons.subdirectory_arrow_right,
                  ),

                  items: subCategories.map(
                    (subCategory) {
                      return DropdownMenuItem<String>(
                        value: subCategory,
                        child: Text(subCategory),
                      );
                    },
                  ).toList(),

                  onChanged:
                      selectedCategory == null
                          ? null
                          : (value) {
                              setState(() {
                                selectedSubCategory =
                                    value;
                              });
                            },
                ),

                const SizedBox(height: 20),

                // Stock
                Container(
                  padding: const EdgeInsets.all(16),

                  decoration: BoxDecoration(
                    borderRadius:
                        BorderRadius.circular(14),
                    border: Border.all(
                      color: Colors.grey.shade300,
                    ),
                  ),

                  child: Row(
                    children: [
                      const Icon(
                        Icons.inventory,
                      ),

                      const SizedBox(width: 12),

                      const Expanded(
                        child: Text(
                          'Stock Status',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight:
                                FontWeight.w600,
                          ),
                        ),
                      ),

                      DropdownButton<String>(
                        value: stockStatus,

                        items: const [
                          DropdownMenuItem(
                            value: 'in-stock',
                            child:
                                Text('In Stock'),
                          ),
                          DropdownMenuItem(
                            value:
                                'out-of-stock',
                            child:
                                Text('Out of Stock'),
                          ),
                        ],

                        onChanged: (value) {
                          if (value != null) {
                            setState(() {
                              stockStatus = value;
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 12),

                // Featured
                Container(
                  decoration: BoxDecoration(
                    borderRadius:
                        BorderRadius.circular(14),
                    border: Border.all(
                      color: Colors.grey.shade300,
                    ),
                  ),

                  child: SwitchListTile(
                    value: featured,
                    onChanged: (value) {
                      setState(() {
                        featured = value;
                      });
                    },
                    title: const Text(
                      'Featured Product',
                      style: TextStyle(
                        fontWeight:
                            FontWeight.w600,
                      ),
                    ),
                    subtitle: const Text(
                      'Show this product as featured',
                    ),
                    secondary: const Icon(
                      Icons.star,
                    ),
                  ),
                ),

                const SizedBox(height: 28),

                // Update button
                SizedBox(
                  width: double.infinity,
                  height: 55,

                  child: ElevatedButton.icon(
                    onPressed:
                        isLoading
                            ? null
                            : updateProduct,

                    icon: isLoading
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child:
                                CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(
                            Icons.save,
                          ),

                    label: Text(
                      isLoading
                          ? 'Updating...'
                          : 'Update Product',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                SizedBox(
                  width: double.infinity,
                  height: 50,

                  child: OutlinedButton(
                    onPressed: isLoading
                        ? null
                        : () {
                            Navigator.pop(
                              context,
                            );
                          },

                    child: const Text(
                      'Cancel',
                      style: TextStyle(
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    nameController.dispose();
    descriptionController.dispose();
    priceController.dispose();
    brandController.dispose();
    super.dispose();
  }
}