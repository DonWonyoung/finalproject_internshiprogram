<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Banner;

class BannerController extends Controller {
    public function index() {
        $banners = Banner::get()->map(function ($banner) {
            return [
                'id' => $banner->id,
                'title' => $banner->title,
                'image_url' => asset('storage/' . $banner->image)
            ];
        });

        return response()->json($banners);
    }
}