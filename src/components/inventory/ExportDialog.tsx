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
import { Database, ClipboardList, X, FileDown } from "lucide-react";
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
    const data = transactions.map(t => {
      // Flatten all aliquots from all storage entries involved in the transaction
      const aliquotsInvolved = (t.storageEntries || [])
        .flatMap(entry => entry.aliquots || [])
        .map(a => `${a.count} x ${a.size} ${a.unit}`)
        .join('; ');

      return {
        'Date': t.timestamp,
        'Material': t.materialName,
        'Lot Number': t.lotNumber,
        'Type': t.type,
        'Quantity': t.quantity,
        'Unit': t.unit,
        'Recipient': t.recipient,
        'Aliquots Involved': aliquotsInvolved,
        'Recorded At': t.recordedAt,
        'Notes': t.notes || ''
      };
    });
    exportToCsv(data, `lab_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2 text-primary mb-1">
            <FileDown className="h-5 w-5" />
            <DialogTitle className="text-xl">Export Laboratory Data</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            Select the report type you wish to generate. Files will be downloaded in CSV format compatible with Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 p-6">
          <button 
            type="button"
            className="group relative flex items-center gap-4 p-4 rounded-xl border-2 border-muted bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-primary" 
            onClick={handleExportInventory}
          >
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">Current Inventory Report</div>
              <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Full list of active materials, current quantities, and storage mappings.
              </div>
            </div>
          </button>

          <button 
            type="button"
            className="group relative flex items-center gap-4 p-4 rounded-xl border-2 border-muted bg-card hover:border-accent/50 hover:bg-accent/5 transition-all text-left outline-none focus-visible:ring-2 focus-visible:ring-accent" 
            onClick={handleExportTransactions}
          >
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ClipboardList className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-foreground">Transaction Audit Log</div>
              <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                Historical record of all stock movements, consumptions, and additions.
              </div>
            </div>
          </button>
        </div>

        <DialogFooter className="bg-muted/30 p-4 px-6 border-t flex items-center justify-between sm:justify-between">
          <p className="text-[10px] text-muted-foreground italic">
            Reports are generated locally for data privacy.
          </p>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8">
            <X className="h-3 w-3 mr-2" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
