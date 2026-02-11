"use client";

import * as React from "react";
import { Material, Aliquot, MaterialUnit } from "@/app/lib/types";
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
import { ArrowLeft, Plus, X, FlaskConical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AddMaterialFormProps {
  onSave: (material: Omit<Material, 'id'>) => void;
  onCancel: () => void;
}

const UNITS: MaterialUnit[] = ['mL', 'L', 'µL', 'mg', 'g', 'kg', 'units', 'vials', 'bottles'];

export function AddMaterialForm({ onSave, onCancel }: AddMaterialFormProps) {
  const [currentLocation, setCurrentLocation] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    project: "",
    lotNumber: "",
    storageLocations: [] as string[],
    concentration: "",
    submissionDate: new Date().toISOString().split('T')[0],
    storageCondition: "Ambient",
    submittedVolume: 0,
    unit: "mL" as MaterialUnit,
    retainAmount: 0,
    retainUnit: "mL" as MaterialUnit,
    aliquots: [] as Aliquot[],
    currentQuantity: 0,
    labelInfo: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalLocations = [...formData.storageLocations];
    if (currentLocation.trim() && !finalLocations.includes(currentLocation.trim())) {
      finalLocations.push(currentLocation.trim());
    }
    
    onSave({
      ...formData,
      storageLocations: finalLocations
    });
  };

  const addLocation = () => {
    if (currentLocation.trim() && !formData.storageLocations.includes(currentLocation.trim())) {
      setFormData({
        ...formData,
        storageLocations: [...formData.storageLocations, currentLocation.trim()]
      });
      setCurrentLocation("");
    }
  };

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      storageLocations: formData.storageLocations.filter((_, i) => i !== index)
    });
  };

  const addAliquot = () => {
    const newAliquot: Aliquot = {
      id: Math.random().toString(36).substr(2, 9),
      count: 0,
      size: 0,
      unit: formData.unit
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
    setFormData({
      ...formData,
      aliquots: formData.aliquots.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    });
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
              Add New Material
            </h1>
            <p className="text-muted-foreground">Add a new material in the laboratory inventory system.</p>
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
            <CardHeader>
              <CardTitle>Storage & Handling</CardTitle>
              <CardDescription>Define where and how the material should be kept.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label>Storage Locations</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Freezer -80 Shelf A" 
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLocation();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addLocation}>
                    <Plus className="h-4 w-4 mr-2" /> Add Location
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.storageLocations.length === 0 && !currentLocation && (
                    <span className="text-sm text-muted-foreground italic">No locations added yet.</span>
                  )}
                  {formData.storageLocations.map((loc, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5 flex items-center gap-2">
                      {loc}
                      <X className="h-3.5 w-3.5 cursor-pointer hover:text-destructive" onClick={() => removeLocation(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="Dessicator">Dessicator</SelectItem>
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
              <CardTitle>Quantity & Documentation</CardTitle>
              <CardDescription>Specify the amount and aliquot breakdowns.</CardDescription>
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
                      placeholder="1982.00"
                      value={formData.submittedVolume || ""}
                      onChange={(e) => setFormData({...formData, submittedVolume: parseFloat(e.target.value) || 0})}
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
                  <Label htmlFor="currentQty">Available Volume (Current)</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="currentQty" 
                      type="number" 
                      step="0.01" 
                      placeholder="1950.00"
                      value={formData.currentQuantity || ""}
                      onChange={(e) => setFormData({...formData, currentQuantity: parseFloat(e.target.value) || 0})}
                      required
                      className="flex-1"
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
                      placeholder="100.00"
                      value={formData.retainAmount || ""}
                      onChange={(e) => setFormData({...formData, retainAmount: parseFloat(e.target.value) || 0})}
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

              <div className="space-y-4 border-t pt-4 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Aliquots</Label>
                    <p className="text-xs text-muted-foreground">Track batches of smaller portions.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addAliquot}>
                    <Plus className="h-4 w-4 mr-2" /> Add Aliquot
                  </Button>
                </div>
                
                {formData.aliquots.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-md border border-dashed">
                    No aliquots recorded.
                  </p>
                )}

                <div className="space-y-3">
                  {formData.aliquots.map((aliquot) => (
                    <div key={aliquot.id} className="flex items-end gap-3 bg-muted/30 p-3 rounded-lg border">
                      <div className="w-24 space-y-1.5">
                        <Label className="text-xs">Count</Label>
                        <Input 
                          type="number" 
                          placeholder="5" 
                          value={aliquot.count || ""}
                          onChange={(e) => updateAliquot(aliquot.id, 'count', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-center pb-2.5 text-muted-foreground">x</div>
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-xs">Size</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="10" 
                          value={aliquot.size || ""}
                          onChange={(e) => updateAliquot(aliquot.id, 'size', parseFloat(e.target.value) || 0)}
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
              </div>

              <div className="space-y-2">
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
              Add Material
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
