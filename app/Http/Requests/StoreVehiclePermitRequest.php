<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehiclePermitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => 'required|string|exists:employees,employee_id',
            'vehicle_type' => 'required|string|max:255',
            'license_plate' => 'required|string|max:255',
            'usage_start' => 'required|date|after:now',
            'usage_end' => 'required|date|after:usage_start',
            'purpose' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.exists' => 'Employee ID not found in our records.',
            'vehicle_type.required' => 'Vehicle type is required.',
            'license_plate.required' => 'License plate is required.',
            'usage_start.required' => 'Start date and time is required.',
            'usage_start.after' => 'Start date must be in the future.',
            'usage_end.required' => 'End date and time is required.',
            'usage_end.after' => 'End date must be after start date.',
        ];
    }
}