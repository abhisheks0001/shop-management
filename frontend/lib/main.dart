import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'screens/auth/admin_login_screen.dart';
import 'screens/admin/admin_dashboard_screen.dart';

void main() {
  runApp(const MyApp());
}

final GoRouter router = GoRouter(
  initialLocation: '/admin-login',
  routes: [
    GoRoute(
      path: '/admin-login',
      builder: (context, state) {
        return const AdminLoginScreen();
      },
    ),

    GoRoute(
      path: '/admin-dashboard',
      builder: (context, state) {
        return const AdminDashboardScreen();
      },
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Shop Management',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
    );
  }
}