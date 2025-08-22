<?php

namespace App\Services;

use App\Models\VehiclePermit;
use App\Models\WhatsappNotification;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    /**
     * Send HR notification for new permit request
     */
    public function sendHrNotification(VehiclePermit $permit): WhatsappNotification
    {
        $message = $this->generateHrMessage($permit);
        
        $notification = WhatsappNotification::create([
            'permit_id' => $permit->id,
            'recipient_phone' => '+1234567890', // Mock HR phone number
            'type' => 'hr_notification',
            'message' => $message,
            'status' => 'pending',
        ]);

        // Simulate sending the message
        $this->mockSendMessage($notification);

        return $notification;
    }

    /**
     * Send employee notification for permit decision
     */
    public function sendEmployeeNotification(VehiclePermit $permit): WhatsappNotification
    {
        $message = $this->generateEmployeeMessage($permit);
        
        $notification = WhatsappNotification::create([
            'permit_id' => $permit->id,
            'recipient_phone' => $permit->employee->phone ?? '+0987654321', // Employee phone or mock
            'type' => 'employee_notification',
            'message' => $message,
            'status' => 'pending',
        ]);

        // Simulate sending the message
        $this->mockSendMessage($notification);

        return $notification;
    }

    /**
     * Generate HR notification message
     */
    public function generateHrMessage(VehiclePermit $permit): string
    {
        $adminUrl = url('/hr-admin?permit=' . $permit->id);
        
        return "🚗 *New Vehicle Permit Request*\n\n" .
               "📋 *Employee:* {$permit->employee->name}\n" .
               "🏢 *Department:* {$permit->employee->department}\n" .
               "🚙 *Vehicle:* {$permit->vehicle_type}\n" .
               "🔢 *License:* {$permit->license_plate}\n" .
               "📅 *Duration:* {$permit->usage_start->format('M d, Y H:i')} - {$permit->usage_end->format('M d, Y H:i')}\n" .
               "📝 *Purpose:* " . ($permit->purpose ?? 'Not specified') . "\n\n" .
               "🔗 *Review & Approve:* {$adminUrl}\n\n" .
               "Please review and approve/reject this request.";
    }

    /**
     * Generate employee notification message
     */
    public function generateEmployeeMessage(VehiclePermit $permit): string
    {
        $status = ucfirst($permit->status);
        $emoji = $permit->status === 'approved' ? '✅' : '❌';
        
        $message = "{$emoji} *Vehicle Permit {$status}*\n\n" .
                  "📋 *Request ID:* #{$permit->id}\n" .
                  "🚙 *Vehicle:* {$permit->vehicle_type}\n" .
                  "🔢 *License:* {$permit->license_plate}\n" .
                  "📅 *Duration:* {$permit->usage_start->format('M d, Y H:i')} - {$permit->usage_end->format('M d, Y H:i')}\n\n";

        if ($permit->hr_comments) {
            $message .= "💬 *HR Comments:* {$permit->hr_comments}\n\n";
        }

        if ($permit->status === 'approved') {
            $message .= "🎉 Your vehicle permit has been approved! You can proceed with your vehicle usage as planned.";
        } else {
            $message .= "❗ Your vehicle permit has been rejected. Please contact HR for more information.";
        }

        return $message;
    }

    /**
     * Mock sending WhatsApp message
     */
    public function mockSendMessage(WhatsappNotification $notification): void
    {
        // Simulate API call delay
        sleep(1);

        // Mock 95% success rate
        $success = random_int(1, 100) <= 95;

        if ($success) {
            $notification->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
            
            Log::info('WhatsApp message sent successfully', [
                'notification_id' => $notification->id,
                'recipient' => $notification->recipient_phone,
                'type' => $notification->type,
            ]);
        } else {
            $notification->update([
                'status' => 'failed',
                'error_message' => 'Mock API failure - network timeout',
            ]);
            
            Log::error('WhatsApp message failed', [
                'notification_id' => $notification->id,
                'recipient' => $notification->recipient_phone,
                'error' => 'Mock API failure',
            ]);
        }
    }
}