<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehiclePermitRequest;
use App\Http\Requests\UpdateVehiclePermitRequest;
use App\Models\Employee;
use App\Models\VehiclePermit;
use App\Services\WhatsappService;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Vehicle permit controller for handling permit requests.
 */
class VehiclePermitController extends Controller
{
    /**
     * WhatsApp notification service.
     *
     * @var WhatsappService
     */
    protected WhatsappService $whatsappService;

    /**
     * Create a new controller instance.
     *
     * @param WhatsappService $whatsappService WhatsApp notification service
     */
    public function __construct(WhatsappService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    /**
     * Display the vehicle permit form.
     */
    public function index()
    {
        return Inertia::render('welcome');
    }

    /**
     * Get employee details by ID.
     */
    public function show(Request $request)
    {
        $employeeId = $request->query('employee_id');
        
        if (!$employeeId) {
            return response()->json(['error' => 'Employee ID is required'], 400);
        }

        $employee = Employee::where('employee_id', $employeeId)->active()->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        return response()->json([
            'name' => $employee->name,
            'department' => $employee->department,
            'grade' => $employee->grade,
        ]);
    }

    /**
     * Store a newly created permit request.
     */
    public function store(StoreVehiclePermitRequest $request)
    {
        $employee = Employee::where('employee_id', $request->employee_id)->active()->firstOrFail();
        
        $permit = VehiclePermit::create([
            'employee_id' => $employee->id,
            'vehicle_type' => $request->vehicle_type,
            'license_plate' => $request->license_plate,
            'usage_start' => $request->usage_start,
            'usage_end' => $request->usage_end,
            'purpose' => $request->purpose,
            'status' => 'pending',
        ]);

        // Send WhatsApp notification to HR
        $this->whatsappService->sendHrNotification($permit);

        return Inertia::render('permit-success', [
            'permit' => $permit->load('employee'),
        ]);
    }

    /**
     * Update the specified permit (HR approval/rejection).
     */
    public function update(UpdateVehiclePermitRequest $request, VehiclePermit $permit)
    {
        $permit->update([
            'status' => $request->status,
            'hr_comments' => $request->hr_comments,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        // Send WhatsApp notification to employee
        $this->whatsappService->sendEmployeeNotification($permit);

        return redirect()->route('hr.dashboard')
            ->with('success', 'Permit ' . $request->status . ' successfully.');
    }
}