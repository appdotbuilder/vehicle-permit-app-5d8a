<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $employees = Employee::latest()->paginate(15);
        
        return Inertia::render('employees/index', [
            'employees' => $employees,
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        return Inertia::render('employees/create');
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $employee = Employee::create($request->validated());

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        $employee->load('permits');
        
        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    /**
     * Show the form for editing the specified employee.
     */
    public function edit(Employee $employee)
    {
        return Inertia::render('employees/edit', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}