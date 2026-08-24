import '../core/network/api_client.dart';

class ApiTestService {
  final ApiClient _apiClient = ApiClient();

  Future<String> testConnection() async {
    try {
      final response = await _apiClient.dio.get('/');
      return response.data.toString();
    } catch (e) {
      return 'Connection failed: $e';
    }
  }
}