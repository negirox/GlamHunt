'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
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
import { Reply, CheckCircle2 } from 'lucide-react';
import { ReplyInquiryDialog } from '@/components/reply-inquiry-dialog';

export function InquiriesClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = React.useState(initialData);
  const [selectedInquiry, setSelectedInquiry] = React.useState<any | null>(null);

  const handleReplied = (repliedInquiry: any) => {
    setData(prevData =>
      prevData.map(item =>
        item.email === repliedInquiry.email && item.subject === repliedInquiry.subject
          ? { ...item, status: 'replied' }
          : item
      )
    );
  };
  
  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No contact inquiries found.</p>
  }

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={`${item.email}-${index}`}>
                <TableCell className="font-medium">
                  <div>{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.email}</div>
                </TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>
                  {item.status === 'replied' ? (
                    <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/50">
                        <CheckCircle2 className="mr-1" /> Replied
                    </Badge>
                  ) : (
                    <Badge variant="outline">New</Badge>
                  )}
                </TableCell>
                 <TableCell>
                  {formatDistanceToNow(new Date(item.submittedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(item)}>
                    <Reply className="mr-2 h-4 w-4" /> Reply
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedInquiry && (
        <ReplyInquiryDialog
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          inquiry={selectedInquiry}
          onReplied={handleReplied}
        />
      )}
    </>
  );
}
