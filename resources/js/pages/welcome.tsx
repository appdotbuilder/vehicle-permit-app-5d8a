import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';



interface EmployeeDetails {
    name: string;
    department: string;
    grade: string;
}

export default function Welcome() {
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const [loadingEmployee, setLoadingEmployee] = useState(false);
    const [employeeError, setEmployeeError] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        vehicle_type: '',
        license_plate: '',
        usage_start: '',
        usage_end: '',
        purpose: ''
    });

    const fetchEmployeeDetails = async (employeeId: string) => {
        if (!employeeId.trim()) {
            setEmployeeDetails(null);
            setEmployeeError(null);
            return;
        }

        setLoadingEmployee(true);
        setEmployeeError(null);

        try {
            const response = await fetch(`/employee-details?employee_id=${encodeURIComponent(employeeId)}`);
            const result = await response.json();

            if (response.ok) {
                setEmployeeDetails(result);
            } else {
                setEmployeeError(result.error || 'Employee not found');
                setEmployeeDetails(null);
            }
        } catch {
            setEmployeeError('Failed to fetch employee details');
            setEmployeeDetails(null);
        } finally {
            setLoadingEmployee(false);
        }
    };

    const handleEmployeeIdChange = (value: string) => {
        setData('employee_id', value);
        
        // Debounce the API call
        setTimeout(() => {
            fetchEmployeeDetails(value);
        }, 500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permits.store'));
    };

    const vehicleTypes = [
        'Sedan',
        'SUV',
        'Pickup Truck',
        'Van',
        'Compact Car',
        'Minibus',
        'Motorcycle',
        'Other'
    ];

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🚗 Vehicle Usage Permit System
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Request permission to use company vehicles quickly and easily
                        </p>
                        
                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl mb-2">📋</div>
                                <h3 className="font-semibold text-gray-800">Quick Application</h3>
                                <p className="text-sm text-gray-600">Auto-populate employee details with ID</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl mb-2">📱</div>
                                <h3 className="font-semibold text-gray-800">Instant Notifications</h3>
                                <p className="text-sm text-gray-600">WhatsApp alerts for HR and employees</p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-2xl mb-2">⚡</div>
                                <h3 className="font-semibold text-gray-800">Real-time Processing</h3>
                                <p className="text-sm text-gray-600">Get approvals in minutes, not hours</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex justify-center gap-4 mb-8">
                            <Button 
                                onClick={() => router.visit('/hr-admin')} 
                                variant="outline"
                                className="bg-white/80 hover:bg-white"
                            >
                                👔 HR Admin Panel
                            </Button>
                        </div>
                    </div>

                    {/* Application Form */}
                    <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📝 Vehicle Usage Permit Application
                            </CardTitle>
                            <CardDescription>
                                Fill out the form below to request permission for vehicle usage
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
                                        onChange={(e) => handleEmployeeIdChange(e.target.value)}
                                        placeholder="Enter your employee ID (e.g., EMP0001)"
                                        className={employeeError ? 'border-red-500' : ''}
                                    />
                                    {errors.employee_id && (
                                        <p className="text-red-500 text-sm">{errors.employee_id}</p>
                                    )}
                                    {employeeError && (
                                        <p className="text-red-500 text-sm">{employeeError}</p>
                                    )}
                                    {loadingEmployee && (
                                        <p className="text-blue-500 text-sm">Loading employee details...</p>
                                    )}
                                </div>

                                {/* Employee Details */}
                                {employeeDetails && (
                                    <Alert className="bg-green-50 border-green-200">
                                        <AlertDescription>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <strong>Name:</strong> {employeeDetails.name}
                                                </div>
                                                <div>
                                                    <strong>Department:</strong> {employeeDetails.department}
                                                </div>
                                                <div>
                                                    <strong>Grade:</strong> <Badge variant="secondary">{employeeDetails.grade}</Badge>
                                                </div>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Vehicle Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                                        <select
                                            id="vehicle_type"
                                            value={data.vehicle_type}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData('vehicle_type', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select vehicle type</option>
                                            {vehicleTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.vehicle_type && (
                                            <p className="text-red-500 text-sm">{errors.vehicle_type}</p>
                                        )}
                                    </div>

                                    {/* License Plate */}
                                    <div className="space-y-2">
                                        <Label htmlFor="license_plate">License Plate *</Label>
                                        <Input
                                            id="license_plate"
                                            value={data.license_plate}
                                            onChange={(e) => setData('license_plate', e.target.value)}
                                            placeholder="e.g., ABC123DE"
                                            className="uppercase"
                                        />
                                        {errors.license_plate && (
                                            <p className="text-red-500 text-sm">{errors.license_plate}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Usage Start */}
                                    <div className="space-y-2">
                                        <Label htmlFor="usage_start">Start Date & Time *</Label>
                                        <Input
                                            id="usage_start"
                                            type="datetime-local"
                                            value={data.usage_start}
                                            onChange={(e) => setData('usage_start', e.target.value)}
                                        />
                                        {errors.usage_start && (
                                            <p className="text-red-500 text-sm">{errors.usage_start}</p>
                                        )}
                                    </div>

                                    {/* Usage End */}
                                    <div className="space-y-2">
                                        <Label htmlFor="usage_end">End Date & Time *</Label>
                                        <Input
                                            id="usage_end"
                                            type="datetime-local"
                                            value={data.usage_end}
                                            onChange={(e) => setData('usage_end', e.target.value)}
                                        />
                                        {errors.usage_end && (
                                            <p className="text-red-500 text-sm">{errors.usage_end}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div className="space-y-2">
                                    <Label htmlFor="purpose">Purpose (Optional)</Label>
                                    <Textarea
                                        id="purpose"
                                        value={data.purpose}
                                        onChange={(e) => setData('purpose', e.target.value)}
                                        placeholder="Describe the purpose of vehicle usage..."
                                        rows={3}
                                    />
                                    {errors.purpose && (
                                        <p className="text-red-500 text-sm">{errors.purpose}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={processing || !employeeDetails}
                                    size="lg"
                                >
                                    {processing ? '🔄 Submitting...' : '🚀 Submit Permit Request'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Process Information */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">1️⃣</div>
                            <h3 className="font-semibold text-gray-800 mb-2">Submit Request</h3>
                            <p className="text-sm text-gray-600">Fill out and submit your permit application</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">2️⃣</div>
                            <h3 className="font-semibold text-gray-800 mb-2">HR Review</h3>
                            <p className="text-sm text-gray-600">HR receives instant notification and reviews your request</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">3️⃣</div>
                            <h3 className="font-semibold text-gray-800 mb-2">Get Notification</h3>
                            <p className="text-sm text-gray-600">Receive WhatsApp notification with approval decision</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}