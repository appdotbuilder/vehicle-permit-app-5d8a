import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
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
    created_at: string;
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

interface Props {
    employees: PaginatedData<Employee>;
    [key: string]: unknown;
}

export default function EmployeesIndex({ employees }: Props) {
    const handleDelete = (employee: Employee) => {
        if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
            router.delete(route('employees.destroy', employee.id));
        }
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
                                    👥 Employee Management
                                </h1>
                                <p className="text-gray-600">
                                    Manage employee data and access permissions
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => router.visit('/hr-admin')}>
                                    👔 Back to HR Dashboard
                                </Button>
                                <Button onClick={() => router.visit(route('employees.create'))}>
                                    ➕ Add Employee
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Employees</CardTitle>
                            <CardDescription>
                                Total: {employees.total} employees
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {employees.data.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Employee ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Department</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {employees.data.map((employee) => (
                                                <TableRow key={employee.id}>
                                                    <TableCell className="font-mono font-medium">
                                                        {employee.employee_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">{employee.name}</div>
                                                    </TableCell>
                                                    <TableCell>{employee.department}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">{employee.grade}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {employee.email && (
                                                                <div>📧 {employee.email}</div>
                                                            )}
                                                            {employee.phone && (
                                                                <div>📱 {employee.phone}</div>
                                                            )}
                                                            {!employee.email && !employee.phone && (
                                                                <div className="text-gray-400">No contact info</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={employee.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-800'
                                                            }
                                                        >
                                                            {employee.is_active ? '✅ Active' : '❌ Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => router.visit(route('employees.show', employee.id))}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => router.visit(route('employees.edit', employee.id))}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDelete(employee)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    {employees.last_page > 1 && (
                                        <div className="flex justify-center mt-6">
                                            <div className="flex gap-2">
                                                {employees.links.map((link, index) => (
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
                                    <div className="text-4xl mb-4">👥</div>
                                    <p>No employees found.</p>
                                    <Button 
                                        onClick={() => router.visit(route('employees.create'))}
                                        className="mt-4"
                                    >
                                        Add First Employee
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}