import 'package:flutter/material.dart';

import '../../services/product_service.dart';
import 'add_product_screen.dart';
import 'edit_product_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final ProductService _productService = ProductService();

  bool isLoading = true;
  String errorMessage = '';

  List<dynamic> products = [];

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  // =========================
  // FETCH PRODUCTS
  // =========================

  Future<void> fetchProducts() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      final result = await _productService.getProducts();

      if (!mounted) return;

      setState(() {
        products = result['products'] ?? [];
        isLoading = false;
      });

      debugPrint(
        'Products loaded: ${products.length}',
      );
    } catch (e) {
      debugPrint(
        'Products error: $e',
      );

      if (!mounted) return;

      setState(() {
        isLoading = false;
        errorMessage = 'Failed to load products';
      });
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  Future<void> deleteProduct(
    Map<String, dynamic> product,
  ) async {
    final productId =
        product['_id']?.toString();

    if (productId == null || productId.isEmpty) {
      _showMessage(
        'Product ID not found',
        isError: true,
      );
      return;
    }

    final productName =
        product['name']?.toString() ??
            'this product';

    // Confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,

      builder: (context) {
        return AlertDialog(
          title: const Text(
            'Delete Product?',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),

          content: Text(
            'Are you sure you want to delete "$productName"?\n\n'
            'This will also remove its images from Cloudinary.',
          ),

          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(
                  context,
                  false,
                );
              },
              child: const Text('Cancel'),
            ),

            ElevatedButton(
              onPressed: () {
                Navigator.pop(
                  context,
                  true,
                );
              },

              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),

              child: const Text(
                'Delete',
              ),
            ),
          ],
        );
      },
    );

    if (confirmed != true) {
      return;
    }

    // Loading dialog
    showDialog(
      context: context,

      barrierDismissible: false,

      builder: (context) {
        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );

    try {
      final result =
          await _productService.deleteProduct(
        productId,
      );

      if (!mounted) return;

      // Close loading dialog
      Navigator.pop(context);

      _showMessage(
        result['message'] ??
            'Product deleted successfully',
      );

      await fetchProducts();
    } catch (e) {
      if (!mounted) return;

      // Close loading dialog
      Navigator.pop(context);

      debugPrint(
        'Delete error: $e',
      );

      _showMessage(
        'Failed to delete product: $e',
        isError: true,
      );
    }
  }

  // =========================
  // MESSAGE
  // =========================

  void _showMessage(
    String message, {
    bool isError = false,
  }) {
    ScaffoldMessenger.of(context)
        .showSnackBar(
      SnackBar(
        content: Text(message),
        behavior:
            SnackBarBehavior.floating,
        backgroundColor:
            isError
                ? Colors.red
                : Colors.green,
      ),
    );
  }

  // =========================
  // BUILD
  // =========================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Products',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),

        centerTitle: true,

        actions: [
          IconButton(
            tooltip: 'Refresh',

            icon: const Icon(
              Icons.refresh,
            ),

            onPressed: isLoading
                ? null
                : fetchProducts,
          ),

          IconButton(
            tooltip: 'Add Product',

            icon: const Icon(
              Icons.add,
            ),

            onPressed: () async {
              final result =
                  await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      const AddProductScreen(),
                ),
              );

              if (result == true) {
                fetchProducts();
              }
            },
          ),
        ],
      ),

      body: RefreshIndicator(
        onRefresh: fetchProducts,
        child: _buildBody(),
      ),
    );
  }

  // =========================
  // BODY
  // =========================

  Widget _buildBody() {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.center,

          children: [
            const Icon(
              Icons.error_outline,
              size: 60,
            ),

            const SizedBox(height: 16),

            Text(
              errorMessage,
              style: const TextStyle(
                fontSize: 18,
              ),
            ),

            const SizedBox(height: 16),

            ElevatedButton(
              onPressed: fetchProducts,
              child: const Text(
                'Retry',
              ),
            ),
          ],
        ),
      );
    }

    if (products.isEmpty) {
      return ListView(
        physics:
            const AlwaysScrollableScrollPhysics(),

        children: const [
          SizedBox(height: 220),

          Center(
            child: Column(
              children: [
                Icon(
                  Icons.inventory_2_outlined,
                  size: 70,
                ),

                SizedBox(height: 16),

                Text(
                  'No products found',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight:
                        FontWeight.bold,
                  ),
                ),

                SizedBox(height: 6),

                Text(
                  'Tap + to add your first product.',
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      physics:
          const AlwaysScrollableScrollPhysics(),

      padding: const EdgeInsets.all(16),

      itemCount: products.length,

      itemBuilder: (context, index) {
        final product =
            products[index];

        return _productCard(
          product,
        );
      },
    );
  }

  // =========================
  // PRODUCT CARD
  // =========================

  Widget _productCard(
    dynamic product,
  ) {
    final String name =
        product['name']?.toString() ??
            'No name';

    final String category =
        product['category']?.toString() ??
            'No category';

    final String subCategory =
        product['subCategory']
                ?.toString() ??
            '';

    final dynamic price =
        product['price'];

    final String stockStatus =
        product['stockStatus']
                ?.toString() ??
            'Unknown';

    final bool featured =
        product['featured'] == true;

    final List<dynamic> images =
        product['images'] is List
            ? product['images']
            : [];

    final bool inStock =
        stockStatus == 'in-stock';

    return Card(
      margin:
          const EdgeInsets.only(
        bottom: 16,
      ),

      elevation: 4,

      shape: RoundedRectangleBorder(
        borderRadius:
            BorderRadius.circular(18),
      ),

      clipBehavior:
          Clip.antiAlias,

      child: Padding(
        padding:
            const EdgeInsets.all(16),

        child: Column(
          children: [
            Row(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              children: [
                // IMAGE
                Container(
                  width: 105,
                  height: 105,

                  decoration:
                      BoxDecoration(
                    borderRadius:
                        BorderRadius.circular(
                      14,
                    ),

                    color:
                        Colors.grey.shade200,
                  ),

                  child: images.isNotEmpty
                      ? ClipRRect(
                          borderRadius:
                              BorderRadius.circular(
                            14,
                          ),

                          child:
                              Image.network(
                            images[0]
                                .toString(),

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
                                size: 40,
                              );
                            },
                          ),
                        )
                      : const Icon(
                          Icons.inventory_2,
                          size: 42,
                        ),
                ),

                const SizedBox(
                  width: 16,
                ),

                // DETAILS
                Expanded(
                  child: Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,

                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              name,
                              style:
                                  const TextStyle(
                                fontSize: 20,
                                fontWeight:
                                    FontWeight.bold,
                              ),
                            ),
                          ),

                          if (featured)
                            const Icon(
                              Icons.star,
                              size: 22,
                            ),
                        ],
                      ),

                      const SizedBox(
                        height: 8,
                      ),

                      Text(
                        '$category'
                        '${subCategory.isNotEmpty ? ' • $subCategory' : ''}',
                        style: TextStyle(
                          fontSize: 14,
                          color:
                              Colors.grey.shade700,
                        ),
                      ),

                      const SizedBox(
                        height: 8,
                      ),

                      Text(
                        '₹$price',
                        style:
                            const TextStyle(
                          fontSize: 19,
                          fontWeight:
                              FontWeight.bold,
                        ),
                      ),

                      const SizedBox(
                        height: 8,
                      ),

                      Container(
                        padding:
                            const EdgeInsets
                                .symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),

                        decoration:
                            BoxDecoration(
                          borderRadius:
                              BorderRadius.circular(
                            20,
                          ),

                          color: inStock
                              ? Colors.green
                                  .withValues(
                                  alpha: 0.12,
                                )
                              : Colors.red
                                  .withValues(
                                  alpha: 0.12,
                                ),
                        ),

                        child: Text(
                          inStock
                              ? 'In Stock'
                              : 'Out of Stock',

                          style: TextStyle(
                            fontSize: 12,
                            fontWeight:
                                FontWeight.w600,
                            color: inStock
                                ? Colors.green
                                : Colors.red,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(
              height: 14,
            ),

            const Divider(),

            const SizedBox(
              height: 4,
            ),

            // ACTIONS
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () async {
                      final result =
                          await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              EditProductScreen(
                            product:
                                Map<String,
                                    dynamic>.from(
                              product,
                            ),
                          ),
                        ),
                      );

                      if (result == true) {
                        fetchProducts();
                      }
                    },

                    icon: const Icon(
                      Icons.edit,
                      size: 19,
                    ),

                    label: const Text(
                      'Edit',
                    ),
                  ),
                ),

                const SizedBox(
                  width: 12,
                ),

                Expanded(
                  child:
                      OutlinedButton.icon(
                    onPressed: () {
                      deleteProduct(
                        Map<String,
                            dynamic>.from(
                          product,
                        ),
                      );
                    },

                    icon: const Icon(
                      Icons.delete_outline,
                      size: 19,
                    ),

                    label: const Text(
                      'Delete',
                    ),

                    style:
                        OutlinedButton.styleFrom(
                      foregroundColor:
                          Colors.red,
                      side: const BorderSide(
                        color: Colors.red,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}