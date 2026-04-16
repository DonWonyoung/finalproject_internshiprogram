<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SubcategoryController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\OrderController;
use App\Http\Controllers\front\ProductController as FrontProductController;
use App\Http\Controllers\admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\front\PasswordResetController;
use App\Http\Controllers\admin\PasswordResetController as AdminPasswordResetController;
use App\Http\Controllers\front\BannerController;
use App\Http\Controllers\front\ReviewController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('admin/login', [AuthController::class, 'authenticate']);
Route::post('customer/login', [AccountController::class, 'authenticate']);
Route::get('get-latest-products', [FrontProductController::class, 'latestProducts']);
Route::get('get-featured-products', [FrontProductController::class, 'featuredProducts']);
Route::get('get-categories', [FrontProductController::class, 'getCategories']);
Route::get('get-subcategories', [FrontProductController::class, 'getSubcategories']);
Route::get('get-products', [FrontProductController::class, 'getProducts']);
Route::get('get-product/{id}', [FrontProductController::class, 'getProduct']);
Route::post('register', [AccountController::class, 'register']);
Route::get('/banners', [BannerController::class, 'index']);

Route::post('customer/forget-password', [PasswordResetController::class, 'forgetPassword']);
Route::post('customer/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::post('/customer/resend-verification', [AccountController::class, 'resendVerification'])->middleware('throttle:1,1');

Route::post('admin/forget-password', [AdminPasswordResetController::class, 'forgetPassword']);
Route::post('admin/reset-password', [AdminPasswordResetController::class, 'resetPassword']);

Route::get('email/verify/{id}/{hash}', function ($id, $hash) {
    $user = User::find($id);

    if (!$user) return response()->json(['message' => 'User not found'], 404);

    // Pastikan hash cocok dengan email pengguna
    if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) return response()->json([
        'status' => 400,
        'message' => 'Invalid verification link'
    ], 400);

    // Jika sudah diverifikasi
    if ($user->hasVerifiedEmail()) return redirect(env('FRONTEND_URL').'/customer/email-verified');

    // Tandai email sudah diverifikasi
    $user->markEmailAsVerified();

    return redirect(env('FRONTEND_URL').'/customer/email-verified');
})->middleware(['signed'])->name('verification.verify');

Route::get('get-reviews/{product_id}', [ReviewController::class, 'getReviews']);

Route::group(['middleware' => ['auth:sanctum', 'checkUserRole']], function() {
    Route::post('save-order', [OrderController::class, 'saveOrder']);
    Route::get('get-order-details/{id}', [AccountController::class, 'getOrderDetails']);
    Route::get('get-orders', [AccountController::class, 'getOrders']);
    Route::get('get-profile-details', [AccountController::class, 'getProfileDetails']);
    Route::get('order/{id}/qr-code', [OrderController::class, 'generateQrCode']);

    Route::post('update-profile', [AccountController::class, 'updateProfile']);
    Route::post('customer/change-password', [AccountController::class, 'changePassword']);

    Route::post('add-review', [ReviewController::class, 'addReview']);
    Route::put('update-review/{id}', [ReviewController::class, 'updateReview']);
    Route::delete('delete-review/{id}', [ReviewController::class, 'deleteReview']);
});

Route::group(['middleware' => ['auth:sanctum', 'checkAdminRole']], function() {
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::resource('products', ProductController::class);
    Route::post('temp-images', [TempImageController::class, 'store']);
    Route::post('save-product-image', [ProductController::class, 'saveProductImage']);
    Route::get('change-product-default-image', [ProductController::class, 'updateDefaultImage']);
    Route::delete('delete-product-image/{id}', [ProductController::class, 'deleteProductImage']);

    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{id}', [AdminOrderController::class, 'detail']);
    Route::post('update-order/{id}', [AdminOrderController::class, 'update']);

    Route::get('dashboard', [DashboardController::class, 'getCounts']);
    Route::post('admin/change-password', [AdminAccountController::class, 'changePassword']);
    Route::get('users', [UserController::class, 'showUsers']);
    Route::delete('users/{id}', [UserController::class, 'deleteUser']);
});