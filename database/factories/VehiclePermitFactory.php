<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehiclePermit>
 */
class VehiclePermitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $usageStart = fake()->dateTimeBetween('now', '+30 days');
        $usageEnd = fake()->dateTimeBetween($usageStart, $usageStart->format('Y-m-d') . ' +8 hours');
        $status = fake()->randomElement(['pending', 'approved', 'rejected']);

        return [
            'employee_id' => Employee::factory(),
            'vehicle_type' => fake()->randomElement([
                'Sedan',
                'SUV',
                'Pickup Truck',
                'Van',
                'Compact Car',
                'Minibus',
                'Motorcycle',
            ]),
            'license_plate' => fake()->regexify('[A-Z]{2}[0-9]{4}[A-Z]{2}'),
            'usage_start' => $usageStart,
            'usage_end' => $usageEnd,
            'purpose' => fake()->optional()->sentence(10),
            'status' => $status,
            'hr_comments' => $status !== 'pending' ? fake()->optional()->sentence() : null,
            'approved_at' => $status !== 'pending' ? fake()->dateTimeBetween($usageStart, 'now') : null,
            'approved_by' => $status !== 'pending' ? User::factory() : null,
        ];
    }

    /**
     * Indicate that the permit is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'hr_comments' => null,
            'approved_at' => null,
            'approved_by' => null,
        ]);
    }

    /**
     * Indicate that the permit is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'hr_comments' => fake()->optional()->sentence(),
            'approved_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'approved_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the permit is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'hr_comments' => fake()->sentence(),
            'approved_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'approved_by' => User::factory(),
        ]);
    }
}