<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class UsersTable {
    public static function configure(Table $table): Table {
        return $table
        ->modifyQueryUsing(fn (Builder $query) => $query->where('role', 'admin'))
        ->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('email')->searchable()
        ])
        ->filters([
            //
        ])
        ->recordActions([
            EditAction::make(),
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);
    }
}