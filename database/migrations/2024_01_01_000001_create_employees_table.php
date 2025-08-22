<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->comment('Employee identification number');
            $table->string('name')->comment('Employee full name');
            $table->string('department')->comment('Employee department');
            $table->string('grade')->comment('Employee grade level');
            $table->string('email')->nullable()->comment('Employee email address');
            $table->string('phone')->nullable()->comment('Employee phone number');
            $table->boolean('is_active')->default(true)->comment('Employee active status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('name');
            $table->index('department');
            $table->index(['is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};