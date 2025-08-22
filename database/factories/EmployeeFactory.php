<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => 'EMP' . str_pad((string) fake()->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'name' => fake()->name(),
            'department' => fake()->randomElement([
                'Human Resources',
                'Information Technology',
                'Finance',
                'Marketing',
                'Operations',
                'Sales',
                'Administration',
                'Legal',
                'Customer Service',
                'Research & Development',
            ]),
            'grade' => fake()->randomElement([
                'Junior',
                'Senior',
                'Lead',
                'Manager',
                'Senior Manager',
                'Director',
            ]),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+1' . fake()->numerify('##########'),
            'is_active' => fake()->boolean(90), // 90% active
        ];
    }

    /**
     * Indicate that the employee is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}