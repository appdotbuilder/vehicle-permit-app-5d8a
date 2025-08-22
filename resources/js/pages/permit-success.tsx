import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Employee {
    name: string;
    employee_id: string;
    department: string;
    grade: string;
}

interface VehiclePermit {
    id: number;
    vehicle_type: string;
    license_plate: string;
    usage_start: string;
    usage_end: string;
    purpose: string | null;
    status: string;
    employee: Employee;
    created_at: string;
}

interface Props {
    permit: VehiclePermit;
    [key: string]: unknown;
}

export default function PermitSuccess({ permit }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-3xl font-bold text-green-800 mb-2">
                            Permit Request Submitted Successfully!
                        </h1>
                        <p className="text-lg text-green-600 mb-4">
                            Your vehicle usage permit has been submitted and is now pending HR approval.
                        </p>
                    </div>

                    {/* Request Details */}
                    <Card className="shadow-xl mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📋 Request Details
                                <Badge variant="secondary" className="ml-auto">
                                    Request #{permit.id}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Submitted on {formatDateTime(permit.created_at)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Employee Info */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <strong>Employee:</strong> {permit.employee.name}
                                </div>
                                <div>
                                    <strong>ID:</strong> {permit.employee.employee_id}
                                </div>
                                <div>
                                    <strong>Department:</strong> {permit.employee.department}
                                </div>
                                <div>
                                    <strong>Grade:</strong> <Badge variant="outline">{permit.employee.grade}</Badge>
                                </div>
                            </div>

                            {/* Vehicle Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <strong>Vehicle Type:</strong>
                                    <div className="text-lg">{permit.vehicle_type}</div>
                                </div>
                                <div>
                                    <strong>License Plate:</strong>
                                    <div className="text-lg font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                                        {permit.license_plate}
                                    </div>
                                </div>
                            </div>

                            {/* Usage Period */}
                            <div>
                                <strong>Usage Period:</strong>
                                <div className="mt-1">
                                    <div className="flex items-center gap-2">
                                        <span>📅 From:</span>
                                        <span>{formatDateTime(permit.usage_start)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📅 To:</span>
                                        <span>{formatDateTime(permit.usage_end)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            {permit.purpose && (
                                <div>
                                    <strong>Purpose:</strong>
                                    <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                                        {permit.purpose}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <strong>Status:</strong>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    ⏳ Pending Approval
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Alert className="mb-8">
                        <AlertDescription>
                            <div className="space-y-3">
                                <div className="font-semibold">📱 What happens next?</div>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold text-blue-600">1.</span>
                                        <span>HR has been notified via WhatsApp and will review your request</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold text-blue-600">2.</span>
                                        <span>You'll receive a WhatsApp notification once a decision is made</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold text-blue-600">3.</span>
                                        <span>Approved permits typically process within 1-2 hours during business hours</span>
                                    </div>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                            onClick={() => router.visit('/')}
                            variant="outline"
                            className="flex-1"
                        >
                            📝 Submit Another Request
                        </Button>
                        <Button 
                            onClick={() => router.visit('/hr-admin')}
                            className="flex-1"
                        >
                            👔 View HR Dashboard
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 text-center text-gray-600">
                        <p className="text-sm">
                            Need help? Contact HR at <strong>hr@company.com</strong> or <strong>+1234567890</strong>
                        </p>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}