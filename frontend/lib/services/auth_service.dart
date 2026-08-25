import '../core/network/api_client.dart';
import '../core/constants/api_constants.dart';

class AuthService {
  final ApiClient _apiClient = ApiClient();

  // =========================
  // ADMIN LOGIN
  // =========================

  Future<Map<String, dynamic>> adminLogin(
    String email,
    String password,
  ) async {
    final response = await _apiClient.dio.post(
      '${ApiConstants.admin}/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // CUSTOMER LOGIN - START
  // =========================

  Future<Map<String, dynamic>> customerLoginStart(
    String name,
    String phone,
  ) async {
    final response = await _apiClient.dio.post(
      '${ApiConstants.customer}/login/start',
      data: {
        'name': name,
        'phone': phone,
      },
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // CUSTOMER LOGIN - VERIFY
  // =========================

  Future<Map<String, dynamic>> customerLoginVerify(
    String name,
    String phone,
    String captcha,
  ) async {
    final response = await _apiClient.dio.post(
      '${ApiConstants.customer}/login/verify',
      data: {
        'name': name,
        'phone': phone,
        'captcha': captcha,
      },
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // ADMIN ME
  // =========================

  Future<Map<String, dynamic>> getAdminProfile() async {
    final response = await _apiClient.dio.get(
      '${ApiConstants.admin}/me',
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // CUSTOMER ME
  // =========================

  Future<Map<String, dynamic>> getCustomerProfile() async {
    final response = await _apiClient.dio.get(
      '${ApiConstants.customer}/me',
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // ADMIN LOGOUT
  // =========================

  Future<Map<String, dynamic>> adminLogout() async {
    final response = await _apiClient.dio.post(
      '${ApiConstants.admin}/logout',
    );

    return Map<String, dynamic>.from(response.data);
  }

  // =========================
  // CUSTOMER LOGOUT
  // =========================

  Future<Map<String, dynamic>> customerLogout() async {
    final response = await _apiClient.dio.post(
      '${ApiConstants.customer}/logout',
    );

    return Map<String, dynamic>.from(response.data);
  }
}