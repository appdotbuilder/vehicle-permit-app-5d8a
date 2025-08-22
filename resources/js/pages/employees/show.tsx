import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface VehiclePermit {
    id: number;
    vehicle_type: string;
    license_plate: string;
    usage_start: string;
    usage_end: string;
    purpose: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    department: string;
    grade: string;
    email: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    permits: VehiclePermit[];
}

interface Props {
    employee: Employee;
    [key: string]: unknown;
}

export default function ShowEmployee({ employee }: Props) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: { className: 'bg-yellow-100 text-yellow-800', emoji: '⏳' },
            approved: { className: 'bg-green-100 text-green-800', emoji: '✅' },
            rejected: { className: 'bg-red-100 text-red-800', emoji: '❌' }
        };
        
        const variant = variants[status as keyof typeof variants];
        return (
            <Badge className={variant.className}>
                {variant.emoji} {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
            router.delete(route('employees.destroy', employee.id));
        }
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button 
                                variant="outline" 
                                onClick={() => router.visit(route('employees.index'))}
                            >
                                ← Back to Employees
                            </Button>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    👤 {employee.name}
                                </h1>
                                <p className="text-gray-600">
                                    Employee ID: {employee.employee_id}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => router.visit(route('employees.edit', employee.id))}
                                >
                                    ✏️ Edit Employee
                                </Button>
                                <Button 
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    🗑️ Delete
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Employee Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    📋 Employee Details
                                    <Badge
                                        className={employee.is_active 
                                            ? 'bg-green-100 text-green-800 ml-auto' 
                                            : 'bg-gray-100 text-gray-800 ml-auto'
                                        }
                                    >
                                        {employee.is_active ? '✅ Active' : '❌ Inactive'}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Employee ID:</strong>
                                        <div className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                                            {employee.employee_id}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Full Name:</strong>
                                        <div className="mt-1">{employee.name}</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Department:</strong>
                                        <div className="mt-1">{employee.department}</div>
                                    </div>
                                    <div>
                                        <strong>Grade:</strong>
                                        <div className="mt-1">
                                            <Badge variant="secondary">{employee.grade}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {(employee.email || employee.phone) && (
                                    <div>
                                        <strong>Contact Information:</strong>
                                        <div className="mt-1 space-y-1">
                                            {employee.email && (
                                                <div className="flex items-center gap-2">
                                                    <span>📧</span>
                                                    <span>{employee.email}</span>
                                                </div>
                                            )}
                                            {employee.phone && (
                                                <div className="flex items-center gap-2">
                                                    <span>📱</span>
                                                    <span>{employee.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <strong>Created:</strong>
                                    <div className="mt-1 text-sm text-gray-600">
                                        {formatDateTime(employee.created_at)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permit Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📊 Permit Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span>Total Requests</span>
                                        <Badge variant="secondary" className="text-lg px-3 py-1">
                                            {employee.permits.length}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span>Pending</span>
                                        <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                                            {employee.permits.filter(p => p.status === 'pending').length}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span>Approved</span>
                                        <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                                            {employee.permits.filter(p => p.status === 'approved').length}
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span>Rejected</span>
                                        <Badge className="bg-red-100 text-red-800 text-lg px-3 py-1">
                                            {employee.permits.filter(p => p.status === 'rejected').length}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vehicle Permits History */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>🚗 Vehicle Permit History</CardTitle>
                            <CardDescription>
                                All vehicle permit requests submitted by this employee
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {employee.permits.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Request ID</TableHead>
                                            <TableHead>Vehicle</TableHead>
                                            <TableHead>Usage Period</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employee.permits.map((permit) => (
                                            <TableRow key={permit.id}>
                                                <TableCell className="font-medium">#{permit.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div>{permit.vehicle_type}</div>
                                                        <div className="text-sm font-mono text-gray-500">
                                                            {permit.license_plate}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{formatDateTime(permit.usage_start)}</div>
                                                        <div className="text-gray-500">to</div>
                                                        <div>{formatDateTime(permit.usage_end)}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs truncate text-sm">
                                                        {permit.purpose || 'Not specified'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(permit.status)}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatDateTime(permit.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-4">🚗</div>
                                    <p>No vehicle permit requests submitted yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}