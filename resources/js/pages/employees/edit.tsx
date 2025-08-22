import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    email: string | null;
    phone: string | null;
    is_active: boolean;
}



interface Props {
    employee: Employee;
    [key: string]: unknown;
}

export default function EditEmployee({ employee }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: employee.employee_id,
        name: employee.name,
        department: employee.department,
        grade: employee.grade,
        email: employee.email || '',
        phone: employee.phone || '',
        is_active: employee.is_active
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    const departments = [
        'Human Resources',
        'Information Technology',
        'Finance',
        'Marketing',
        'Operations',
        'Sales',
        'Administration',
        'Legal',
        'Customer Service',
        'Research & Development'
    ];

    const grades = [
        'Junior',
        'Senior',
        'Lead',
        'Manager',
        'Senior Manager',
        'Director'
    ];

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button 
                                variant="outline" 
                                onClick={() => router.visit(route('employees.show', employee.id))}
                            >
                                ← Back to Employee
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ✏️ Edit Employee
                        </h1>
                        <p className="text-gray-600">
                            Update employee information for {employee.name}
                        </p>
                    </div>

                    {/* Form */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle>Employee Information</CardTitle>
                            <CardDescription>
                                Update the employee details below
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Employee ID */}
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">Employee ID *</Label>
                                    <Input
                                        id="employee_id"
                                        value={data.employee_id}
                                        onChange={(e) => setData('employee_id', e.target.value)}
                                        placeholder="e.g., EMP0001"
                                        className="uppercase"
                                    />
                                    {errors.employee_id && (
                                        <p className="text-red-500 text-sm">{errors.employee_id}</p>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter employee's full name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Department */}
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department *</Label>
                                        <select
                                            id="department"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        {errors.department && (
                                            <p className="text-red-500 text-sm">{errors.department}</p>
                                        )}
                                    </div>

                                    {/* Grade */}
                                    <div className="space-y-2">
                                        <Label htmlFor="grade">Grade *</Label>
                                        <select
                                            id="grade"
                                            value={data.grade}
                                            onChange={(e) => setData('grade', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select grade</option>
                                            {grades.map((grade) => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                        {errors.grade && (
                                            <p className="text-red-500 text-sm">{errors.grade}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="employee@company.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+1234567890"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked: boolean) => setData('is_active', checked as unknown as boolean)}
                                    />
                                    <Label htmlFor="is_active">
                                        Active Employee (can submit permit requests)
                                    </Label>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => router.visit(route('employees.show', employee.id))}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing ? 'Updating...' : '💾 Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}