import 'package:flutter/material.dart';
import '../../core/network/api_client.dart';
import 'add_product_screen.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final ApiClient _apiClient = ApiClient();

  bool isLoading = true;
  String errorMessage = '';

  List<dynamic> products = [];

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      final response = await _apiClient.dio.get('/api/products');

      setState(() {
        products = response.data['products'] ?? [];
        isLoading = false;
      });

      debugPrint('Products loaded: ${products.length}');
    } catch (e) {
      debugPrint('Products error: $e');

      setState(() {
        isLoading = false;
        errorMessage = 'Failed to load products';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
  title: const Text('Products'),
  centerTitle: true,

  actions: [
    IconButton(
      icon: const Icon(Icons.add),
      tooltip: 'Add Product',

      onPressed: () async {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const AddProductScreen(),
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

  Widget _buildBody() {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
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
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (products.isEmpty) {
      return const Center(
        child: Text(
          'No products found',
          style: TextStyle(
            fontSize: 20,
          ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),

      itemCount: products.length,

      itemBuilder: (context, index) {
        final product = products[index];

        return _productCard(product);
      },
    );
  }

  Widget _productCard(dynamic product) {
    final String name = product['name']?.toString() ?? 'No name';

    final String category =
        product['category']?.toString() ?? 'No category';

    final String subCategory =
        product['subCategory']?.toString() ?? '';

    final dynamic price = product['price'];

    final String stockStatus =
        product['stockStatus']?.toString() ?? 'Unknown';

    final List<dynamic> images =
        product['images'] is List ? product['images'] : [];

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 3,

      child: Padding(
        padding: const EdgeInsets.all(16),

        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [
            // Product image
            Container(
              width: 100,
              height: 100,

              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: Colors.grey.shade200,
              ),

              child: images.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),

                      child: Image.network(
                        images[0].toString(),
                        fit: BoxFit.cover,

                        errorBuilder:
                            (context, error, stackTrace) {
                          return const Icon(
                            Icons.image_not_supported,
                            size: 40,
                          );
                        },
                      ),
                    )
                  : const Icon(
                      Icons.inventory_2,
                      size: 40,
                    ),
            ),

            const SizedBox(width: 16),

            // Product details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,

                children: [
                  Text(
                    name,

                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    '$category${subCategory.isNotEmpty ? ' • $subCategory' : ''}',

                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    '₹${price ?? 0}',

                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 8),

                  Text(
                    'Stock: $stockStatus',

                    style: const TextStyle(
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}