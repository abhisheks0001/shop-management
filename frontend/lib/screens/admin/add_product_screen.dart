import 'package:flutter/material.dart';
import '../../services/product_service.dart';

class AddProductScreen extends StatefulWidget {
  const AddProductScreen({super.key});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final ProductService _productService = ProductService();

  final nameController = TextEditingController();
  final descriptionController = TextEditingController();
  final priceController = TextEditingController();
  final brandController = TextEditingController();

  bool isLoading = false;
  bool featured = false;

  String? selectedCategory;
  String? selectedSubCategory;

  String stockStatus = 'in-stock';

  String message = '';

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

  Future<void> addProduct() async {
    if (nameController.text.trim().isEmpty ||
        descriptionController.text.trim().isEmpty ||
        priceController.text.trim().isEmpty ||
        selectedCategory == null ||
        selectedSubCategory == null) {
      setState(() {
        message = 'Please fill all required fields';
      });
      return;
    }

    final double? price =
        double.tryParse(priceController.text.trim());

    if (price == null || price < 0) {
      setState(() {
        message = 'Please enter a valid price';
      });
      return;
    }

    setState(() {
      isLoading = true;
      message = '';
    });

    try {
      final result = await _productService.addProduct(
        name: nameController.text.trim(),
        description: descriptionController.text.trim(),
        price: price,
        category: selectedCategory!,
        subCategory: selectedSubCategory!,
        brand: brandController.text.trim(),
        stockStatus: stockStatus,
        featured: featured,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            result['message'] ?? 'Product added successfully',
          ),
        ),
      );

      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        message = 'Failed to add product: $e';
      });
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    nameController.dispose();
    descriptionController.dispose();
    priceController.dispose();
    brandController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final subCategories =
        selectedCategory == null
            ? <String>[]
            : categories[selectedCategory!] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Product'),
        centerTitle: true,
      ),

      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),

          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 600,
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,

              children: [
                const Text(
                  'Add New Product',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 25),

                // Product Name
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Product Name *',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.inventory_2),
                  ),
                ),

                const SizedBox(height: 16),

                // Description
                TextField(
                  controller: descriptionController,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    labelText: 'Description *',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.description),
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
                  decoration: const InputDecoration(
                    labelText: 'Price *',
                    prefixText: '₹ ',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.currency_rupee),
                  ),
                ),

                const SizedBox(height: 16),

                // Category
                DropdownButtonFormField<String>(
                  value: selectedCategory,

                  decoration: const InputDecoration(
                    labelText: 'Category *',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.category),
                  ),

                  items: categories.keys.map((category) {
                    return DropdownMenuItem(
                      value: category,
                      child: Text(category),
                    );
                  }).toList(),

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
                  value: selectedSubCategory,

                  decoration: const InputDecoration(
                    labelText: 'Subcategory *',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.subdirectory_arrow_right),
                  ),

                  items: subCategories.map((subCategory) {
                    return DropdownMenuItem(
                      value: subCategory,
                      child: Text(subCategory),
                    );
                  }).toList(),

                  onChanged: selectedCategory == null
                      ? null
                      : (value) {
                          setState(() {
                            selectedSubCategory = value;
                          });
                        },
                ),

                const SizedBox(height: 16),

                // Brand
                TextField(
                  controller: brandController,
                  decoration: const InputDecoration(
                    labelText: 'Brand',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.branding_watermark),
                  ),
                ),

                const SizedBox(height: 16),

                // Stock Status
                DropdownButtonFormField<String>(
                  value: stockStatus,

                  decoration: const InputDecoration(
                    labelText: 'Stock Status',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.inventory),
                  ),

                  items: const [
                    DropdownMenuItem(
                      value: 'in-stock',
                      child: Text('In Stock'),
                    ),
                    DropdownMenuItem(
                      value: 'out-of-stock',
                      child: Text('Out of Stock'),
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

                const SizedBox(height: 10),

                // Featured
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,

                  title: const Text(
                    'Featured Product',
                  ),

                  subtitle: const Text(
                    'Show this product as featured',
                  ),

                  value: featured,

                  onChanged: (value) {
                    setState(() {
                      featured = value;
                    });
                  },
                ),

                const SizedBox(height: 20),

                // Error message
                if (message.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(
                      bottom: 16,
                    ),

                    child: Text(
                      message,
                      style: const TextStyle(
                        color: Colors.red,
                      ),
                    ),
                  ),

                // Add Button
                SizedBox(
                  width: double.infinity,
                  height: 52,

                  child: ElevatedButton(
                    onPressed:
                        isLoading ? null : addProduct,

                    child: isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'Add Product',
                            style: TextStyle(
                              fontSize: 17,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}