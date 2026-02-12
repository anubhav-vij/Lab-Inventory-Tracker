"use client";

import * as React from "react";
import { Material, TransactionType, Aliquot, MaterialUnit, StorageEntry } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SmartInput } from "@/components/inventory/SmartInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Save, History, MapPin, Layers, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TransactionFormProps {
  material: Material;
  onSave: (data: {
    type: TransactionType;
    quantity: number;
    unit: string;
    timestamp: string;
    recipient: string;
    storageEntries: StorageEntry[];
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
    storageEntries: [] as StorageEntry[],
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addStorageEntry = () => {
    const newEntry: StorageEntry = {
      id: Math.random().toString(36).substr(2, 9),
      location: "",
      aliquots: []
    };
    setFormData({
      ...formData,
      storageEntries: [...formData.storageEntries, newEntry]
    });
  };

  const updateStorageEntry = (id: string, location: string) => {
    setFormData({
      ...formData,
      storageEntries: formData.storageEntries.map(entry => 
        entry.id === id ? { ...entry, location } : entry
      )
    });
  };

  const removeStorageEntry = (id: string) => {
    setFormData({
      ...formData,
      storageEntries: formData.storageEntries.filter(entry => entry.id !== id)
    });
  };

  const addAliquotToEntry = (entryId: string) => {
    setFormData({
      ...formData,
      storageEntries: formData.storageEntries.map(entry => {
        if (entry.id === entryId) {
          const newAliquot: Aliquot = {
            id: Math.random().toString(36).substr(2, 9),
            count: 0,
            size: 0,
            unit: formData.unit as MaterialUnit
          };
          return { ...entry, aliquots: [...entry.aliquots, newAliquot] };
        }
        return entry;
      })
    });
  };

  const updateAliquotInEntry = (entryId: string, aliquotId: string, field: keyof Aliquot, value: any) => {
    let sanitizedValue = value;
    if (field === 'count' || field === 'size') {
      sanitizedValue = Math.max(0, parseFloat(value) || 0);
    }
    const updatedEntries = formData.storageEntries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          aliquots: entry.aliquots.map(a => 
            a.id === aliquotId ? { ...a, [field]: sanitizedValue } : a
          )
        };
      }
      return entry;
    });

    // Automatically calculate total volume from aliquots
    const totalVolume = updatedEntries.reduce((sum, entry) => {
      return sum + entry.aliquots.reduce((aSum, a) => aSum + (a.count * a.size), 0);
    }, 0);

    setFormData({
      ...formData,
      storageEntries: updatedEntries,
      quantity: totalVolume
    });
  };

  const removeAliquotFromEntry = (entryId: string, aliquotId: string) => {
    const updatedEntries = formData.storageEntries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          aliquots: entry.aliquots.filter(a => a.id !== aliquotId)
        };
      }
      return entry;
    });

    const totalVolume = updatedEntries.reduce((sum, entry) => {
      return sum + entry.aliquots.reduce((aSum, a) => aSum + (a.count * a.size), 0);
    }, 0);

    setFormData({
      ...formData,
      storageEntries: updatedEntries,
      quantity: totalVolume
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
            <div className="flex gap-4 items-center">
              <p className="text-muted-foreground">
                Lot #: <span className="font-mono font-bold text-foreground">{material.lotNumber}</span>
              </p>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Available: {material.currentQuantity} {material.unit}
              </Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Define the type and context of this inventory change.</CardDescription>
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
                  <SmartInput 
                    id="recipient"
                    fieldName="Recipient Name"
                    placeholder="Full name or Employee ID" 
                    defaultValue={formData.recipient}
                    onValueChange={(v) => setFormData({...formData, recipient: v})}
                    required={formData.type === 'consumption'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">Total Transaction Volume</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="volume" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      placeholder="0.00"
                      value={formData.quantity}
                      onChange={(e) => handleNumericChange('quantity', e.target.value)}
                      required 
                      className="flex-1 bg-muted/50"
                      readOnly
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
                  <p className="text-[10px] text-muted-foreground italic">Calculated automatically from aliquots below.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Storage & Aliquots Involved</CardTitle>
                <CardDescription>Specify which specific aliquots are being moved or issued.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStorageEntry}>
                <MapPin className="h-4 w-4 mr-2" /> Add Location Mapping
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.storageEntries.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground italic">No location mapping specified. Click 'Add Location Mapping' to track batch movement.</p>
                </div>
              )}
              
              {formData.storageEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-xl bg-card shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Source/Target Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Match inventory location path (e.g. F81*S1*R5*B1)" 
                          className="pl-9"
                          value={entry.location}
                          onChange={(e) => updateStorageEntry(entry.id, e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="mt-6 text-destructive hover:bg-destructive/10"
                      onClick={() => removeStorageEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-muted">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold flex items-center gap-2">
                        <Layers className="h-3 w-3" /> Transactional Aliquots
                      </Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addAliquotToEntry(entry.id)} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Batch
                      </Button>
                    </div>

                    {entry.aliquots.map((aliquot) => (
                      <div key={aliquot.id} className="flex items-end gap-3 bg-muted/30 p-2 rounded-lg border group relative">
                        <div className="w-20 space-y-1">
                          <Label className="text-[10px]">Count</Label>
                          <Input 
                            type="number" 
                            min="0"
                            className="h-8 text-xs"
                            value={aliquot.count}
                            onChange={(e) => updateAliquotInEntry(entry.id, aliquot.id, 'count', e.target.value)}
                          />
                        </div>
                        <div className="pb-1.5 text-muted-foreground text-xs">x</div>
                        <div className="flex-1 space-y-1">
                          <Label className="text-[10px]">Size</Label>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            className="h-8 text-xs"
                            value={aliquot.size}
                            onChange={(e) => updateAliquotInEntry(entry.id, aliquot.id, 'size', e.target.value)}
                          />
                        </div>
                        <div className="w-24 space-y-1">
                          <Label className="text-[10px]">Unit</Label>
                          <Select 
                            value={aliquot.unit} 
                            onValueChange={(v) => updateAliquotInEntry(entry.id, aliquot.id, 'unit', v as MaterialUnit)}
                          >
                            <SelectTrigger className="h-8 text-xs">
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
                          className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeAliquotFromEntry(entry.id, aliquot.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
