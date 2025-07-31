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
import { useToast } from '@/hooks/use-toast';
import { handleReplyForm } from '@/app/actions';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

interface ReplyInquiryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: any;
  onReplied: (inquiry: any) => void;
}

const initialState = {
  status: 'idle',
  message: '',
};

export function ReplyInquiryDialog({ isOpen, onClose, inquiry, onReplied }: ReplyInquiryDialogProps) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(handleReplyForm, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);


  React.useEffect(() => {
    if (state.status === 'success') {
      toast({ title: 'Success', description: state.message });
      onReplied(inquiry);
      onClose();
    } else if (state.status === 'error') {
      toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state, toast, onClose, onReplied, inquiry]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to: {inquiry.name}</DialogTitle>
          <DialogDescription>
            Replying to inquiry about: "{inquiry.subject}"
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="to" value={inquiry.email} />
          <input type="hidden" name="original_email" value={inquiry.email} />
          <input type="hidden" name="subject" value={inquiry.subject} />

          <div className="space-y-4 py-4">
            <div className='p-4 bg-muted/50 rounded-lg text-sm'>
                <p className="font-semibold">Original Message:</p>
                <p className="text-muted-foreground">{inquiry.message}</p>
            </div>
             <div>
                <Label htmlFor="message">Your Reply</Label>
                <Textarea id="message" name="message" rows={8} placeholder="Type your reply here..." required />
             </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Send Reply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
