<?php

namespace App\Filament\Resources\Banners\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BannerForm {
    public static function configure(Schema $schema): Schema {
        return $schema
        ->components([
            TextInput::make('name')->required(),
            FileUpload::make('image')
            ->image()
            ->disk('public')          // ⬅️ INI YANG PALING PENTING
            ->directory('banners')    // simpan ke storage/app/public/banners
            ->visibility('public')    // biar bisa diakses URL
            ->imageEditor(false)          // ⬅️ matikan editor
            ->imagePreviewHeight('150')   // preview kecil aja
            ->maxSize(2048)
            ->required()
        ]);
    }
}