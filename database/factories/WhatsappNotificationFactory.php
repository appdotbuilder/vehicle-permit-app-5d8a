<?php

namespace Database\Factories;

use App\Models\VehiclePermit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WhatsappNotification>
 */
class WhatsappNotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['hr_notification', 'employee_notification']);
        $status = fake()->randomElement(['pending', 'sent', 'failed']);

        return [
            'permit_id' => VehiclePermit::factory(),
            'recipient_phone' => '+1' . fake()->numerify('##########'),
            'type' => $type,
            'message' => fake()->paragraph(),
            'status' => $status,
            'sent_at' => $status === 'sent' ? fake()->dateTimeBetween('-7 days', 'now') : null,
            'error_message' => $status === 'failed' ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the notification is for HR.
     */
    public function forHr(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'hr_notification',
            'recipient_phone' => '+1234567890',
        ]);
    }

    /**
     * Indicate that the notification is for employee.
     */
    public function forEmployee(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'employee_notification',
        ]);
    }

    /**
     * Indicate that the notification was sent successfully.
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'sent_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'error_message' => null,
        ]);
    }

    /**
     * Indicate that the notification failed to send.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'sent_at' => null,
            'error_message' => fake()->sentence(),
        ]);
    }
}