"use client";

import * as React from "react";
import { Material } from "@/app/lib/types";
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
import { ArrowLeft, Plus, X, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AddMaterialFormProps {
  onSave: (material: Omit<Material, 'id' | 'currentQuantity'>) => void;
  onCancel: () => void;
}

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
    unit: "mL" as any,
    labelInfo: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add final current location if not empty and not already added
    let finalLocations = [...formData.storageLocations];
    if (currentLocation.trim() && !finalLocations.includes(currentLocation.trim())) {
      finalLocations.push(currentLocation.trim());
    }
    
    onSave({
      ...formData,
      storageLocations: finalLocations
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
    setFormData({ ...formData, submittedVolume: isNaN(val) ? 0 : val });
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
            <p className="text-muted-foreground">Register a new material or batch in the laboratory inventory system.</p>
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
              <CardDescription>Specify the amount and any additional metadata.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Initial Amount</Label>
                  <Input 
                    id="volume" 
                    type="number" 
                    step="0.01" 
                    value={formData.submittedVolume === 0 ? "" : formData.submittedVolume.toString()}
                    onChange={handleVolumeChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(v) => setFormData({...formData, unit: v as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mL">mL</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="µL">µL</SelectItem>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="units">units</SelectItem>
                      <SelectItem value="vials">vials</SelectItem>
                      <SelectItem value="bottles">bottles</SelectItem>
                    </SelectContent>
                  </Select>
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