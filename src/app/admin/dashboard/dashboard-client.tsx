'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateRegistrationStatus } from '@/app/admin/actions';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function DashboardClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = React.useState(initialData);
  const { toast } = useToast();

  const handleStatusUpdate = async (email: string, status: 'approved' | 'rejected') => {
    const result = await updateRegistrationStatus(email, status);
    if (result.status === 'success') {
      setData((prevData) =>
        prevData.map((item) =>
          item.email === email ? { ...item, status } : item
        )
      );
      toast({
        title: 'Status Updated',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.message,
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/50"><CheckCircle2 className="mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1" /> Pending</Badge>;
    }
  }

  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No registrations found.</p>
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.email}>
              <TableCell className="font-medium">{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell className="capitalize">{item.role}</TableCell>
              <TableCell>{item.dob ? new Date(item.dob).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(item.email, 'approved')}
                        disabled={item.status === 'approved'}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusUpdate(item.email, 'rejected')}
                        disabled={item.status === 'rejected'}
                    >
                        Reject
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
