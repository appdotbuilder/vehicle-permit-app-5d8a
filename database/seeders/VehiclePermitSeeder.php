<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use App\Models\VehiclePermit;
use App\Models\WhatsappNotification;
use Illuminate\Database\Seeder;

class VehiclePermitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create HR admin user
        $hrUser = User::firstOrCreate(
            ['email' => 'hr@company.com'],
            [
                'name' => 'HR Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create sample employees
        $employees = Employee::factory(20)->create();

        // Create sample vehicle permits with various statuses
        $permits = collect();

        // Pending permits
        $pendingPermits = VehiclePermit::factory(8)
            ->pending()
            ->recycle($employees)
            ->create();
        $permits = $permits->merge($pendingPermits);

        // Approved permits
        $approvedPermits = VehiclePermit::factory(12)
            ->approved()
            ->recycle($employees)
            ->state(['approved_by' => $hrUser->id])
            ->create();
        $permits = $permits->merge($approvedPermits);

        // Rejected permits
        $rejectedPermits = VehiclePermit::factory(5)
            ->rejected()
            ->recycle($employees)
            ->state(['approved_by' => $hrUser->id])
            ->create();
        $permits = $permits->merge($rejectedPermits);

        // Create WhatsApp notifications for permits
        foreach ($permits as $permit) {
            // HR notification for all permits
            WhatsappNotification::factory()
                ->forHr()
                ->sent()
                ->create(['permit_id' => $permit->id]);

            // Employee notification for approved/rejected permits
            if ($permit->status !== 'pending') {
                WhatsappNotification::factory()
                    ->forEmployee()
                    ->sent()
                    ->create([
                        'permit_id' => $permit->id,
                        'recipient_phone' => $permit->employee->phone,
                    ]);
            }
        }

        $this->command->info('Created:');
        $this->command->info('- 1 HR admin user (hr@company.com / password)');
        $this->command->info('- 20 employees');
        $this->command->info('- 25 vehicle permits (8 pending, 12 approved, 5 rejected)');
        $this->command->info('- WhatsApp notifications for all permits');
    }
}