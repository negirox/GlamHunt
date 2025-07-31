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
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Star, Edit, Ban } from 'lucide-react';
import { ManageRegistrationDialog } from '@/components/manage-registration-dialog';

export function DashboardClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = React.useState(initialData);
  const [selectedReg, setSelectedReg] = React.useState<any | null>(null);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const { toast } = useToast();

  const handleUpdate = (updatedReg: any) => {
     setData((prevData) =>
        prevData.map((item) =>
          item.email === updatedReg.email ? { ...item, ...updatedReg } : item
        )
      );
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/50"><CheckCircle2 className="mr-1" /> Active</Badge>;
      case 'rejected':
      case 'blocked':
        return <Badge variant="destructive"><Ban className="mr-1" /> Blocked</Badge>;
       case 'inactive':
        return <Badge variant="secondary"><XCircle className="mr-1" /> Inactive</Badge>;
      default:
        return <Badge variant="outline"><Clock className="mr-1" /> Pending</Badge>;
    }
  }

  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No registrations found.</p>
  }

  return (
    <>
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.email}>
              <TableCell className="font-medium">
                <div>{item.fullName}</div>
                <div className="text-xs text-muted-foreground">{item.email}</div>
              </TableCell>
              <TableCell className="capitalize">{item.role}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                 {item.verified ? (
                    <ShieldCheck className="h-5 w-5 text-green-400" /> 
                 ) : (
                    <ShieldCheck className="h-5 w-5 text-muted-foreground/50" />
                 )}
              </TableCell>
              <TableCell>
                {item.featured ? (
                    <Star className="h-5 w-5 text-yellow-400" />
                ) : (
                    <Star className="h-5 w-5 text-muted-foreground/50" />
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => setSelectedReg(item)}>
                  <Edit className="mr-2 h-4 w-4" /> Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
     {selectedReg && (
        <ManageRegistrationDialog
          isOpen={!!selectedReg}
          onClose={() => setSelectedReg(null)}
          registration={selectedReg}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
