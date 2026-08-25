import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../services/auth_service.dart';

class AdminLoginScreen extends StatefulWidget {
  const AdminLoginScreen({super.key});

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final AuthService _authService = AuthService();

  bool isLoading = false;
  String message = '';

  Future<void> login() async {
    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (emailController.text.trim().isEmpty ||
        passwordController.text.isEmpty) {
      setState(() {
        message = 'Please enter email and password';
      });
      return;
    }

    // -----------------------------
    // START LOADING
    // -----------------------------
    setState(() {
      isLoading = true;
      message = '';
    });

    try {
      // -----------------------------
      // CALL BACKEND
      // -----------------------------
      final result = await _authService.adminLogin(
        emailController.text.trim(),
        passwordController.text,
      );

      debugPrint('Admin login response: $result');

      // -----------------------------
      // LOGIN SUCCESS
      // -----------------------------
      if (result['message'] == 'Admin login successful') {
        debugPrint('Admin login successful');

        if (!mounted) {
          return;
        }

        // Navigate to Admin Dashboard
        context.go('/admin-dashboard');

        return;
      }

      // -----------------------------
      // LOGIN FAILED
      // -----------------------------
      if (mounted) {
        setState(() {
          message = result['message'] ?? 'Login failed';
        });
      }
    } catch (e) {
      debugPrint('Admin login error: $e');

      if (mounted) {
        setState(() {
          message = 'Login failed: $e';
        });
      }
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
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Login'),
        centerTitle: true,
      ),

      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),

          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 450,
            ),

            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // -----------------------------
                // TITLE
                // -----------------------------
                const Text(
                  'Admin Login',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 30),

                // -----------------------------
                // EMAIL
                // -----------------------------
                TextField(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,

                  decoration: const InputDecoration(
                    labelText: 'Email',
                    hintText: 'Enter admin email',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email),
                  ),
                ),

                const SizedBox(height: 16),

                // -----------------------------
                // PASSWORD
                // -----------------------------
                TextField(
                  controller: passwordController,
                  obscureText: true,

                  decoration: const InputDecoration(
                    labelText: 'Password',
                    hintText: 'Enter password',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
                  ),
                ),

                const SizedBox(height: 24),

                // -----------------------------
                // LOGIN BUTTON
                // -----------------------------
                SizedBox(
                  width: double.infinity,
                  height: 50,

                  child: ElevatedButton(
                    onPressed: isLoading ? null : login,

                    child: isLoading
                        ? const SizedBox(
                            height: 24,
                            width: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            'Login',
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 20),

                // -----------------------------
                // ERROR / MESSAGE
                // -----------------------------
                if (message.isNotEmpty)
                  Text(
                    message,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 15,
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