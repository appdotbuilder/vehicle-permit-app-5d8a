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
        Schema::create('vehicle_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('vehicle_type')->comment('Type of vehicle requested');
            $table->string('license_plate')->comment('Vehicle license plate number');
            $table->datetime('usage_start')->comment('Start date and time for vehicle usage');
            $table->datetime('usage_end')->comment('End date and time for vehicle usage');
            $table->text('purpose')->nullable()->comment('Purpose of vehicle usage');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->comment('Permit status');
            $table->text('hr_comments')->nullable();
            $table->timestamp('approved_at')->nullable()->comment('Timestamp when permit was approved/rejected');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('usage_start');
            $table->index('usage_end');
            $table->index(['status', 'created_at']);
            $table->index(['employee_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_permits');
    }
};