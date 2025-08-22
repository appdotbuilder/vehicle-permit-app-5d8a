import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Employee {
    id: number;
    name: string;
    employee_id: string;
    department: string;
    grade: string;
}

interface User {
    id: number;
    name: string;
}

interface VehiclePermit {
    id: number;
    vehicle_type: string;
    license_plate: string;
    usage_start: string;
    usage_end: string;
    purpose: string | null;
    status: 'pending' | 'approved' | 'rejected';
    hr_comments: string | null;
    approved_at: string | null;
    created_at: string;
    employee: Employee;
    approver: User | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface Filters {
    status?: string;
    from_date?: string;
    to_date?: string;
}

interface Props {
    permits: PaginatedData<VehiclePermit>;
    stats: Stats;
    filters: Filters;
    [key: string]: unknown;
}



export default function HrDashboard({ permits, stats, filters }: Props) {
    const [selectedPermit, setSelectedPermit] = useState<VehiclePermit | null>(null);
    const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        status: 'approved',
        hr_comments: ''
    });

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

    const handleDecision = (permit: VehiclePermit) => {
        setSelectedPermit(permit);
        reset();
        setIsDecisionDialogOpen(true);
    };

    const submitDecision = () => {
        if (!selectedPermit) return;
        
        put(route('permits.update', selectedPermit.id), {
            onSuccess: () => {
                setIsDecisionDialogOpen(false);
                setSelectedPermit(null);
                reset();
            }
        });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filters.from_date) params.append('from_date', filters.from_date);
        if (filters.to_date) params.append('to_date', filters.to_date);
        
        window.location.href = `/hr-admin/export?${params.toString()}`;
    };

    const handleFilter = (filterType: string, value: string) => {
        const newFilters = { ...filters, [filterType]: value };
        router.get('/hr-admin', newFilters, { preserveState: true });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    👔 HR Admin Dashboard
                                </h1>
                                <p className="text-gray-600">
                                    Manage vehicle permit requests and employee data
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => router.visit('/employees')}
                                    variant="outline"
                                >
                                    👥 Manage Employees
                                </Button>
                                <Button 
                                    onClick={() => router.visit('/')}
                                    variant="outline"
                                >
                                    🚗 Permit Form
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="text-2xl">📊</div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Pending</p>
                                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <div className="text-2xl">⏳</div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Approved</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                                    </div>
                                    <div className="text-2xl">✅</div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Rejected</p>
                                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                                    </div>
                                    <div className="text-2xl">❌</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Export */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Filters & Export</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Status</Label>
                                    <select
                                        value={filters.status || 'all'}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilter('status', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>From Date</Label>
                                    <Input
                                        type="date"
                                        value={filters.from_date || ''}
                                        onChange={(e) => handleFilter('from_date', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>To Date</Label>
                                    <Input
                                        type="date"
                                        value={filters.to_date || ''}
                                        onChange={(e) => handleFilter('to_date', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={handleExport} className="w-full">
                                        📊 Export CSV
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permits Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Permit Requests</CardTitle>
                            <CardDescription>
                                Real-time view of all vehicle permit requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {permits.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Request ID</TableHead>
                                                <TableHead>Employee</TableHead>
                                                <TableHead>Vehicle</TableHead>
                                                <TableHead>Usage Period</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {permits.data.map((permit) => (
                                                <TableRow key={permit.id}>
                                                    <TableCell className="font-medium">#{permit.id}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{permit.employee.name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {permit.employee.employee_id} • {permit.employee.department}
                                                            </div>
                                                        </div>
                                                    </TableCell>
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
                                                        {getStatusBadge(permit.status)}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {formatDateTime(permit.created_at)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {permit.status === 'pending' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleDecision(permit)}
                                                            >
                                                                Review
                                                            </Button>
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs">
                                                                {permit.status === 'approved' ? 'Approved' : 'Rejected'}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {permits.last_page > 1 && (
                                        <div className="flex justify-center mt-6">
                                            <div className="flex gap-2">
                                                {permits.links.map((link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => link.url && router.visit(link.url)}
                                                        disabled={!link.url}
                                                    >
                                                        {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No permit requests found.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Decision Dialog */}
                    <Dialog open={isDecisionDialogOpen} onOpenChange={setIsDecisionDialogOpen}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Review Permit Request #{selectedPermit?.id}</DialogTitle>
                                <DialogDescription>
                                    Make a decision on this vehicle usage permit request
                                </DialogDescription>
                            </DialogHeader>
                            
                            {selectedPermit && (
                                <div className="space-y-4">
                                    {/* Request Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div><strong>Employee:</strong> {selectedPermit.employee.name} ({selectedPermit.employee.employee_id})</div>
                                        <div><strong>Department:</strong> {selectedPermit.employee.department}</div>
                                        <div><strong>Vehicle:</strong> {selectedPermit.vehicle_type} - {selectedPermit.license_plate}</div>
                                        <div><strong>Period:</strong> {formatDateTime(selectedPermit.usage_start)} to {formatDateTime(selectedPermit.usage_end)}</div>
                                        {selectedPermit.purpose && (
                                            <div><strong>Purpose:</strong> {selectedPermit.purpose}</div>
                                        )}
                                    </div>

                                    {/* Decision Form */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Decision</Label>
                                            <div className="flex gap-4 mt-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        value="approved"
                                                        checked={data.status === 'approved'}
                                                        onChange={(e) => setData('status', e.target.value as 'approved' | 'rejected')}
                                                    />
                                                    <span className="text-green-600">✅ Approve</span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        value="rejected"
                                                        checked={data.status === 'rejected'}
                                                        onChange={(e) => setData('status', e.target.value as 'approved' | 'rejected')}
                                                    />
                                                    <span className="text-red-600">❌ Reject</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="hr_comments">Comments (Optional)</Label>
                                            <Textarea
                                                id="hr_comments"
                                                value={data.hr_comments}
                                                onChange={(e) => setData('hr_comments', e.target.value)}
                                                placeholder="Add any comments about your decision..."
                                                rows={3}
                                            />
                                            {errors.hr_comments && (
                                                <p className="text-red-500 text-sm mt-1">{errors.hr_comments}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDecisionDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={submitDecision} disabled={processing}>
                                    {processing ? 'Processing...' : `${data.status === 'approved' ? 'Approve' : 'Reject'} Request`}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppShell>
    );
}