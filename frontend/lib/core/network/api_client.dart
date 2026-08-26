import 'package:dio/dio.dart';
import 'package:dio/browser.dart';

import '../constants/api_constants.dart';

class ApiClient {
  final Dio dio;

  ApiClient()
      : dio = Dio(
          BaseOptions(
            baseUrl: ApiConstants.baseUrl,
            connectTimeout: const Duration(seconds: 10),
            receiveTimeout: const Duration(seconds: 10),
            headers: {
              'Content-Type': 'application/json',
            },
          ),
        ) {
    dio.httpClientAdapter = BrowserHttpClientAdapter()
      ..withCredentials = true;
  }
}