"use client";

import * as React from "react";
import { Material, TransactionType } from "@/app/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TransactionDialogProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: {
    type: TransactionType;
    quantity: number;
    recipient: string;
    aliquotsDescription: string;
    notes: string;
  }) => void;
}

export function TransactionDialog({ material, isOpen, onClose, onSave }: TransactionDialogProps) {
  const [type, setType] = React.useState<TransactionType>("consumption");
  const [quantity, setQuantity] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [aliquotsDescription, setAliquotsDescription] = React.useState("");
  const [notes, setNotes] = React.useState("");

  if (!material) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Math.max(0, parseFloat(quantity) || 0);
    onSave({
      type,
      quantity: qty,
      recipient,
      aliquotsDescription,
      notes,
    });
    // Reset form
    setQuantity("");
    setRecipient("");
    setAliquotsDescription("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Transaction</DialogTitle>
            <DialogDescription>
              Record how much of <strong>{material.name}</strong> is being used or adjusted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumption">Consumption (Stock Down)</SelectItem>
                  <SelectItem value="addition">Addition (Stock Up)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Stock Correct)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient / Authorized User</Label>
              <Input
                id="recipient"
                placeholder="Name of person receiving material"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required={type === 'consumption'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Volume ({material.unit})</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aliquots">Aliquots Given</Label>
                <Input
                  id="aliquots"
                  placeholder="e.g. 2 x 5mL"
                  value={aliquotsDescription}
                  onChange={(e) => setAliquotsDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Reason for transaction, project details, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
