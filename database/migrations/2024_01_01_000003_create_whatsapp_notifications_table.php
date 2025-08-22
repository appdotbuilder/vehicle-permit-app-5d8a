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
        Schema::create('whatsapp_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permit_id')->constrained('vehicle_permits')->onDelete('cascade');
            $table->string('recipient_phone')->comment('Phone number of notification recipient');
            $table->enum('type', ['hr_notification', 'employee_notification'])->comment('Type of notification');
            $table->text('message')->comment('WhatsApp message content');
            $table->enum('status', ['pending', 'sent', 'failed'])->default('pending')->comment('Notification status');
            $table->timestamp('sent_at')->nullable()->comment('Timestamp when notification was sent');
            $table->text('error_message')->nullable()->comment('Error message if sending failed');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('permit_id');
            $table->index('type');
            $table->index('status');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_notifications');
    }
};