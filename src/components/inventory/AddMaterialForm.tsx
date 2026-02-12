"use client";

import * as React from "react";
import { Material, Aliquot, MaterialUnit, StorageEntry } from "@/app/lib/types";
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
import { calculateTotalFromEntries } from "@/app/lib/units";
import { ArrowLeft, Plus, X, FlaskConical, Trash2, Save, MapPin, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AddMaterialFormProps {
  onSave: (material: Material | Omit<Material, 'id'>) => void;
  onCancel: () => void;
  initialData?: Material;
}

const UNITS: MaterialUnit[] = ['mL', 'L', 'µL', 'mg', 'g', 'kg', 'units', 'vials', 'bottles'];

export function AddMaterialForm({ onSave, onCancel, initialData }: AddMaterialFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    project: initialData?.project || "",
    lotNumber: initialData?.lotNumber || "",
    storageEntries: initialData?.storageEntries || [] as StorageEntry[],
    concentration: initialData?.concentration || "",
    submissionDate: initialData?.submissionDate || new Date().toISOString().split('T')[0],
    storageCondition: initialData?.storageCondition || "Ambient",
    submittedVolume: Number(initialData?.submittedVolume ?? 0),
    unit: initialData?.unit || "mL",
    retainAmount: Number(initialData?.retainAmount ?? 0),
    retainUnit: initialData?.retainUnit || "mL",
    currentQuantity: Number(initialData?.currentQuantity ?? 0),
    labelInfo: initialData?.labelInfo || "",
    notes: initialData?.notes || ""
  });

  const isEditing = !!initialData;

  // Recalculate currentQuantity whenever storageEntries change
  React.useEffect(() => {
    const totalVolume = calculateTotalFromEntries(formData.storageEntries, formData.unit as MaterialUnit);
    
    if (totalVolume !== formData.currentQuantity) {
      setFormData(prev => ({ ...prev, currentQuantity: totalVolume }));
    }
  }, [formData.storageEntries, formData.unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      submittedVolume: Number(formData.submittedVolume),
      retainAmount: Number(formData.retainAmount),
      currentQuantity: Number(formData.currentQuantity)
    };

    if (isEditing) {
      onSave({ ...dataToSave, id: initialData.id } as Material);
    } else {
      onSave(dataToSave as Omit<Material, 'id'>);
    }
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
    
    setFormData({
      ...formData,
      storageEntries: formData.storageEntries.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            aliquots: entry.aliquots.map(a => 
              a.id === aliquotId ? { ...a, [field]: sanitizedValue } : a
            )
          };
        }
        return entry;
      })
    });
  };

  const removeAliquotFromEntry = (entryId: string, aliquotId: string) => {
    setFormData({
      ...formData,
      storageEntries: formData.storageEntries.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            aliquots: entry.aliquots.filter(a => a.id !== aliquotId)
          };
        }
        return entry;
      })
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
              <FlaskConical className="h-8 w-8" />
              {isEditing ? `Edit ${formData.name}` : "Add New Material"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing 
                ? "Update material specifications and storage details." 
                : "Add a new material in the laboratory inventory system."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Material Identification</CardTitle>
              <CardDescription>Enter the core details for the material.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name</Label>
                  <Input 
                    id="name"
                    placeholder="e.g. Sodium Chloride" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project Assignment</Label>
                  <Select 
                    value={formData.project} 
                    onValueChange={(v) => setFormData({...formData, project: v})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alpha-Chem">Alpha-Chem</SelectItem>
                      <SelectItem value="Bio-React">Bio-React</SelectItem>
                      <SelectItem value="Gamma-Lab">Gamma-Lab</SelectItem>
                      <SelectItem value="Delta-Research">Delta-Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lot">Lot Number</Label>
                  <Input 
                    id="lot" 
                    placeholder="Batch # / Lot #" 
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({...formData, lotNumber: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concentration">Concentration</Label>
                  <Input 
                    id="concentration" 
                    placeholder="e.g. 5M, 99%" 
                    value={formData.concentration}
                    onChange={(e) => setFormData({...formData, concentration: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Storage & Aliquots Mapping</CardTitle>
                <CardDescription>Map specific aliquots to their storage locations. Available quantity is calculated from these values.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addStorageEntry}>
                <MapPin className="h-4 w-4 mr-2" /> Add Location
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.storageEntries.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground italic">No storage entries mapped. Click 'Add Location' to start.</p>
                </div>
              )}
              
              {formData.storageEntries.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-xl bg-card shadow-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Location Path</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="e.g. F81*S1*R5*B1" 
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
                        <Layers className="h-3 w-3" /> Aliquots at this location
                      </Label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => addAliquotToEntry(entry.id)} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Aliquot Set
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
                            step="0.0001" 
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="condition">Storage Condition</Label>
                  <Select 
                    value={formData.storageCondition} 
                    onValueChange={(v) => setFormData({...formData, storageCondition: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambient">Ambient</SelectItem>
                      <SelectItem value="4°C Fridge">4°C Fridge</SelectItem>
                      <SelectItem value="-20°C Freezer">-20°C Freezer</SelectItem>
                      <SelectItem value="-80°C Freezer">-80°C Freezer</SelectItem>
                      <SelectItem value="LN2">LN2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Submission Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={formData.submissionDate}
                    onChange={(e) => setFormData({...formData, submissionDate: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quantities & Retain</CardTitle>
              <CardDescription>Specify the total amounts and what is held back.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Submitted Volume</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="volume" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={formData.submittedVolume}
                      onChange={(e) => handleNumericChange('submittedVolume', e.target.value)}
                      required 
                      className="flex-1"
                    />
                    <Select 
                      value={formData.unit} 
                      onValueChange={(v) => setFormData({...formData, unit: v as MaterialUnit})}
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
                <div className="space-y-2">
                  <Label htmlFor="currentQty">Available Volume (Calculated from Aliquots)</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="currentQty" 
                      type="number" 
                      step="0.0001" 
                      min="0"
                      value={formData.currentQuantity}
                      readOnly
                      className="flex-1 bg-muted/50 cursor-not-allowed font-bold text-primary"
                    />
                    <div className="w-[110px] flex items-center px-3 text-sm text-muted-foreground bg-muted rounded-md border">
                      {formData.unit}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="retain">Retain Amount</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="retain" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={formData.retainAmount}
                      onChange={(e) => handleNumericChange('retainAmount', e.target.value)}
                      className="flex-1"
                    />
                    <Select 
                      value={formData.retainUnit} 
                      onValueChange={(v) => setFormData({...formData, retainUnit: v as MaterialUnit})}
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

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="labelInfo">Label Information</Label>
                <Input 
                  id="labelInfo" 
                  placeholder="e.g. Hazardous, Light Sensitive" 
                  value={formData.labelInfo}
                  onChange={(e) => setFormData({...formData, labelInfo: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Optional notes or handling instructions..." 
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
              {isEditing ? <><Save className="mr-2 h-4 w-4" /> Save Changes</> : "Add Material"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
