<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\VehiclePermit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HrController extends Controller
{
    /**
     * Display the HR dashboard with permits.
     */
    public function index(Request $request)
    {
        $query = VehiclePermit::with(['employee', 'approver'])
            ->latest();

        // Filter by status if provided
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $permits = $query->paginate(15);
        
        // Get summary statistics
        $stats = [
            'total' => VehiclePermit::count(),
            'pending' => VehiclePermit::pending()->count(),
            'approved' => VehiclePermit::approved()->count(),
            'rejected' => VehiclePermit::rejected()->count(),
        ];

        return Inertia::render('hr-dashboard', [
            'permits' => $permits,
            'stats' => $stats,
            'filters' => $request->only(['status', 'from_date', 'to_date']),
        ]);
    }

    /**
     * Show the export form for permits data.
     */
    public function show(Request $request)
    {
        $query = VehiclePermit::with(['employee', 'approver']);

        // Apply filters
        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        
        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $permits = $query->get();

        $filename = 'vehicle_permits_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return new StreamedResponse(function () use ($permits) {
            $handle = fopen('php://output', 'w');
            
            // CSV Headers
            fputcsv($handle, [
                'Request ID',
                'Employee ID',
                'Employee Name',
                'Department',
                'Grade',
                'Vehicle Type',
                'License Plate',
                'Usage Start',
                'Usage End',
                'Purpose',
                'Status',
                'HR Comments',
                'Approved By',
                'Approved At',
                'Submitted At',
            ]);

            // CSV Data
            foreach ($permits as $permit) {
                fputcsv($handle, [
                    $permit->id,
                    $permit->employee->employee_id,
                    $permit->employee->name,
                    $permit->employee->department,
                    $permit->employee->grade,
                    $permit->vehicle_type,
                    $permit->license_plate,
                    $permit->usage_start->format('Y-m-d H:i'),
                    $permit->usage_end->format('Y-m-d H:i'),
                    $permit->purpose,
                    ucfirst($permit->status),
                    $permit->hr_comments,
                    $permit->approver->name ?? '',
                    $permit->approved_at?->format('Y-m-d H:i') ?? '',
                    $permit->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}