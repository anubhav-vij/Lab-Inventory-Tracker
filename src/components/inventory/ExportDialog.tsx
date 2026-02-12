"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Table as TableIcon } from "lucide-react";
import { Material, Transaction } from "@/app/lib/types";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: Material[];
  transactions: Transaction[];
}

export function ExportDialog({ open, onOpenChange, materials, transactions }: ExportDialogProps) {
  const exportToCsv = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? "" : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInventory = () => {
    const data = materials.map(m => ({
      'Material Name': m.name,
      'Project': m.project,
      'Lot Number': m.lotNumber,
      'Storage Condition': m.storageCondition,
      'Submitted Volume': m.submittedVolume,
      'Unit': m.unit,
      'Retain Amount': m.retainAmount,
      'Current Quantity': m.currentQuantity,
      'Storage Locations': m.storageEntries.map(e => e.location).join('; '),
      'Concentration': m.concentration,
      'Submission Date': m.submissionDate,
      'Notes': m.notes || ''
    }));
    exportToCsv(data, `lab_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    onOpenChange(false);
  };

  const handleExportTransactions = () => {
    const data = transactions.map(t => ({
      'Date': t.timestamp,
      'Material': t.materialName,
      'Lot Number': t.lotNumber,
      'Type': t.type,
      'Quantity': t.quantity,
      'Unit': t.unit,
      'Recipient': t.recipient,
      'Recorded At': t.recordedAt,
      'Notes': t.notes || ''
    }));
    exportToCsv(data, `lab_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose which report you would like to download in CSV format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-4 h-20 px-4" 
            onClick={handleExportInventory}
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TableIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Inventory Report</div>
              <div className="text-xs text-muted-foreground">Download current stock levels and storage mapping.</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-start gap-4 h-20 px-4" 
            onClick={handleExportTransactions}
          >
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Transactions Log</div>
              <div className="text-xs text-muted-foreground">Download full history of stock additions and consumptions.</div>
            </div>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}