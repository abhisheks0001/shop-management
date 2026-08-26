import '../core/network/api_client.dart';

class ProductService {
  final ApiClient _apiClient = ApiClient();

  Future<Map<String, dynamic>> getProducts() async {
    final response = await _apiClient.dio.get('/api/products');

    return Map<String, dynamic>.from(response.data);
  }

  Future<Map<String, dynamic>> addProduct({
    required String name,
    required String description,
    required double price,
    required String category,
    required String subCategory,
    String? brand,
    required String stockStatus,
    required bool featured,
  }) async {
    final response = await _apiClient.dio.post(
      '/api/products',
      data: {
        'name': name,
        'description': description,
        'price': price,
        'category': category,
        'subCategory': subCategory,
        'brand': brand ?? '',
        'images': [],
        'stockStatus': stockStatus,
        'featured': featured,
      },
    );

    return Map<String, dynamic>.from(response.data);
  }
}