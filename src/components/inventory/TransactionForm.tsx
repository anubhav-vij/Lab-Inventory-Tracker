"use client";

import * as React from "react";
import { Material, TransactionType, Aliquot, MaterialUnit } from "@/app/lib/types";
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
import { ArrowLeft, Plus, Trash2, Save, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TransactionFormProps {
  material: Material;
  onSave: (data: {
    type: TransactionType;
    quantity: number;
    unit: string;
    timestamp: string;
    recipient: string;
    aliquots: Aliquot[];
    notes: string;
  }) => void;
  onCancel: () => void;
}

const UNITS: MaterialUnit[] = ['mL', 'L', 'µL', 'mg', 'g', 'kg', 'units', 'vials', 'bottles'];

export function TransactionForm({ material, onSave, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = React.useState({
    type: "consumption" as TransactionType,
    quantity: 0,
    unit: material.unit as string,
    timestamp: new Date().toISOString().split('T')[0],
    recipient: "",
    aliquots: [] as Aliquot[],
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAliquot = () => {
    const newAliquot: Aliquot = {
      id: Math.random().toString(36).substr(2, 9),
      count: 0,
      size: 0,
      unit: formData.unit as MaterialUnit
    };
    setFormData({
      ...formData,
      aliquots: [...formData.aliquots, newAliquot]
    });
  };

  const removeAliquot = (id: string) => {
    setFormData({
      ...formData,
      aliquots: formData.aliquots.filter(a => a.id !== id)
    });
  };

  const updateAliquot = (id: string, field: keyof Aliquot, value: any) => {
    let sanitizedValue = value;
    if (field === 'count' || field === 'size') {
      sanitizedValue = Math.max(0, parseFloat(value) || 0);
    }
    setFormData({
      ...formData,
      aliquots: formData.aliquots.map(a => 
        a.id === id ? { ...a, [field]: sanitizedValue } : a
      )
    });
  };

  const handleNumericChange = (field: string, value: string) => {
    const parsed = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: Math.max(0, parsed) }));
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 animate-in slide-in-from-right duration-300">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              <History className="h-8 w-8" />
              Record Transaction: {material.name}
            </h1>
            <p className="text-muted-foreground">
              Log material consumption, additions, or inventory adjustments.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Define the type and scale of this inventory change.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({...formData, type: v as TransactionType})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumption">Consumption (Stock Down)</SelectItem>
                      <SelectItem value="addition">Addition (Stock Up)</SelectItem>
                      <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timestamp">Transaction Date</Label>
                  <Input 
                    id="timestamp" 
                    type="date" 
                    value={formData.timestamp}
                    onChange={(e) => setFormData({...formData, timestamp: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient / Authorized Personnel</Label>
                  <Input 
                    id="recipient"
                    placeholder="Full name or Employee ID" 
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    required={formData.type === 'consumption'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Transaction Volume</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="volume" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="0.00"
                      value={formData.quantity || ""}
                      onChange={(e) => handleNumericChange('quantity', e.target.value)}
                      required 
                      className="flex-1"
                    />
                    <Select 
                      value={formData.unit} 
                      onValueChange={(v) => setFormData({...formData, unit: v})}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aliquots Given</CardTitle>
              <CardDescription>Track the specific batch breakdown for this transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aliquots</Label>
                  <p className="text-xs text-muted-foreground">Log smaller vials or containers issued.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addAliquot}>
                  <Plus className="h-4 w-4 mr-2" /> Add Aliquot
                </Button>
              </div>
              
              {formData.aliquots.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-6 bg-muted/20 rounded-md border border-dashed">
                  No aliquots recorded for this transaction.
                </p>
              )}

              <div className="space-y-3">
                {formData.aliquots.map((aliquot) => (
                  <div key={aliquot.id} className="flex items-end gap-3 bg-muted/30 p-3 rounded-lg border">
                    <div className="w-24 space-y-1.5">
                      <Label className="text-xs">Count</Label>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="1" 
                        value={aliquot.count || ""}
                        onChange={(e) => updateAliquot(aliquot.id, 'count', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center pb-2.5 text-muted-foreground">x</div>
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs">Size</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0"
                        placeholder="10.00" 
                        value={aliquot.size || ""}
                        onChange={(e) => updateAliquot(aliquot.id, 'size', e.target.value)}
                      />
                    </div>
                    <div className="w-[110px] space-y-1.5">
                      <Label className="text-xs">Unit</Label>
                      <Select 
                        value={aliquot.unit} 
                        onValueChange={(v) => updateAliquot(aliquot.id, 'unit', v as MaterialUnit)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeAliquot(aliquot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Additional context for the audit trail.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Optional context, project codes, or handling observations..." 
                  className="min-h-[100px]"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-12">
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" size="lg" className="min-w-[200px]">
              <Save className="mr-2 h-4 w-4" /> Save Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
