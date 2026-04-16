<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Illuminate\Http\Request;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\ErrorCorrectionLevel;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller {
    public function saveOrder(Request $request) {
        if (empty($request->cart)) {
            return response()->json([
                'status' => 400,
                'message' => 'Keranjang Anda kosong.'
            ], 400);
        }

        // Validasi metode pembayaran
        if (!in_array($request->payment_method, ['qris', 'cod'])) {
            return response()->json([
                'status' => 400,
                'message' => 'Metode pembayaran tidak valid.'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // 1️⃣ VALIDASI STOK SEMUA ITEM
            foreach ($request->cart as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (!$product) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 404,
                        'message' => 'Produk tidak ditemukan.'
                    ], 404);
                }

                if ($product->quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 400,
                        'message' => "Stok {$product->title} tidak mencukupi. Sisa: {$product->quantity}"
                    ], 400);
                }
            }

            // 2️⃣ SIMPAN ORDER
            $order = new Order();
            $order->name = $request->name;
            $order->email = $request->email;
            $order->address = $request->address;
            $order->mobile = $request->mobile;
            $order->city = $request->city;
            $order->state = $request->state;
            $order->zip = $request->zip;
            $order->total = $request->total;
            $order->payment_method = $request->payment_method;
            $order->status = 'pending';
            $order->user_id = $request->user()->id;

            // Status pembayaran ditentukan backend
            if ($request->payment_method === 'qris') {
                $order->payment_status = 'not_paid';
                $order->expires_at = now()->addMinutes(5);
            } else {
                $order->payment_status = 'cod_pending';
                $order->expires_at = null;
            }

            $order->save();

            // 3️⃣ SIMPAN ITEM & KURANGI STOK
            foreach ($request->cart as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                // Kurangi stok
                $product->quantity -= $item['quantity'];
                $product->save();

                // Simpan item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'price' => $item['quantity'] * $item['price'],
                    'name' => $item['title']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'id' => $order->id,
                'message' => 'Pesanan berhasil dibuat.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Terjadi kesalahan server.'
            ], 500);
        }
    }

    public function generateQrCode($id) {
        $order = Order::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        // ❌ COD tidak boleh punya QR
        if ($order->payment_method !== 'qris') {
            return response()->json([
                'success' => false,
                'message' => 'QR hanya tersedia untuk pembayaran QRIS.'
            ], 403);
        }

        // ❌ Sudah dibayar tidak perlu QR
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan ini sudah dibayar.'
            ], 400);
        }

        try {
            $data = json_encode([
                'order_id' => $order->id,
                'amount' => $order->total,
                'payment_method' => 'qris'
            ]);

            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($data)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size(250)
                ->margin(10)
                ->build();

            $qrBase64 = base64_encode($result->getString());

            return response()->json([
                'success' => true,
                'qr_code' => 'data:image/png;base64,' . $qrBase64,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat QR.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrder(Request $request, $id) {
        // Pastikan admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'status' => 403,
                'message' => 'Akses ditolak.'
            ], 403);
        }

        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        $order->status = $request->status;
        $order->payment_status = $request->payment_status;
        $order->save();

        return response()->json([
            'status' => 200,
            'data' => $order,
            'message' => 'Pesanan berhasil diperbarui.'
        ]);
    }

    public function markAsPaid($id) {
        $order = Order::find($id);

        if (!$order || $order->payment_method !== 'qris') {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak valid.'
            ], 400);
        }

        $order->payment_status = 'paid';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dikonfirmasi.'
        ]);
    }
}