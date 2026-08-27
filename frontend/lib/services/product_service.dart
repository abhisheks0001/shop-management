import '../core/network/api_client.dart';

class ProductService {
  final ApiClient _apiClient = ApiClient();

  // =========================
  // GET ALL PRODUCTS
  // =========================

  Future<Map<String, dynamic>> getProducts() async {
    final response = await _apiClient.dio.get(
      '/api/products',
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // ADD PRODUCT
  // =========================

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

  // =========================
  // UPDATE PRODUCT
  // =========================

  Future<Map<String, dynamic>> updateProduct({
    required String id,
    required String name,
    required String description,
    required double price,
    required String category,
    required String subCategory,
    String? brand,
    required String stockStatus,
    required bool featured,
    required List<String> images,
  }) async {
    final response = await _apiClient.dio.put(
      '/api/products/$id',
      data: {
        'name': name,
        'description': description,
        'price': price,
        'category': category,
        'subCategory': subCategory,
        'brand': brand ?? '',
        'images': images,
        'stockStatus': stockStatus,
        'featured': featured,
      },
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  Future<Map<String, dynamic>> deleteProduct(
    String id,
  ) async {
    final response = await _apiClient.dio.delete(
      '/api/products/$id',
    );

    return Map<String, dynamic>.from(response.data);
  }
}