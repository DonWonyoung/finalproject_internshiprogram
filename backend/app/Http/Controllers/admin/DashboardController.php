<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;

class DashboardController extends Controller {
    public function getCounts() {
        $counts = [
            'users' => User::where('role', 'customer')->count(),
            'orders' => Order::count(),
            'products' => Product::count()
        ];

        return response()->json([
            'status' => 200,
            'data' => $counts,
        ]);
    }
}