'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateRegistration } from '@/app/admin/actions';

interface ManageRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  registration: any;
  onUpdate: (updatedReg: any) => void;
}

const initialState = {
  status: 'idle',
  message: '',
};

export function ManageRegistrationDialog({ isOpen, onClose, registration, onUpdate }: ManageRegistrationDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updateRegistration, initialState);

  const [verified, setVerified] = React.useState(registration.verified || false);
  const [featured, setFeatured] = React.useState(registration.featured || false);
  const [status, setStatus] = React.useState(registration.status || 'pending');

  React.useEffect(() => {
    if (state.status === 'success') {
      toast({ title: 'Success', description: state.message });
      onUpdate({ email: registration.email, verified, featured, status });
      onClose();
    } else if (state.status === 'error') {
      toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state]);

  // Reset internal state if the registration prop changes
  React.useEffect(() => {
    setVerified(registration.verified || false);
    setFeatured(registration.featured || false);
    setStatus(registration.status || 'pending');
  }, [registration]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage: {registration.fullName}</DialogTitle>
          <DialogDescription>Update the status and attributes for this registration.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="email" value={registration.email} />
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="status">Status</Label>
                <p className="text-xs text-muted-foreground">Set the current status of the profile.</p>
              </div>
               <Select name="status" defaultValue={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="verified">Verified Profile</Label>
                 <p className="text-xs text-muted-foreground">Mark this profile as officially verified.</p>
              </div>
              <input type="hidden" name="verified" value={String(verified)} />
              <Switch id="verified" checked={verified} onCheckedChange={setVerified} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured Model</Label>
                 <p className="text-xs text-muted-foreground">Feature this model on the homepage.</p>
              </div>
              <input type="hidden" name="featured" value={String(featured)} />
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
