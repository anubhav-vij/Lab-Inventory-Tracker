
"use client";

import * as React from "react";
import { Material } from "@/app/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { SmartInput } from "./SmartInput";
import { Plus } from "lucide-react";

interface AddMaterialDialogProps {
  onSave: (material: Omit<Material, 'id' | 'currentQuantity'>) => void;
}

export function AddMaterialDialog({ onSave }: AddMaterialDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    project: "",
    lotNumber: "",
    storageLocation: "",
    concentration: "",
    submissionDate: new Date().toISOString().split('T')[0],
    storageCondition: "Ambient",
    submittedVolume: 0,
    unit: "mL" as const,
    labelInfo: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
    // Reset form
    setFormData({
      name: "",
      project: "",
      lotNumber: "",
      storageLocation: "",
      concentration: "",
      submissionDate: new Date().toISOString().split('T')[0],
      storageCondition: "Ambient",
      submittedVolume: 0,
      unit: "mL",
      labelInfo: "",
      notes: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>
              Add a new material in the laboratory inventory system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Material Name</Label>
                <SmartInput 
                  fieldName="Material Name" 
                  placeholder="e.g. Sodium Chloride" 
                  onValueChange={(v) => setFormData({...formData, name: v})}
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <SmartInput 
                  fieldName="Storage Location" 
                  placeholder="e.g. Freezer -80 Shelf A" 
                  onValueChange={(v) => setFormData({...formData, storageLocation: v})}
                  required
                />
              </div>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Initial Amount</Label>
                <Input 
                  id="volume" 
                  type="number" 
                  step="0.01" 
                  value={formData.submittedVolume}
                  onChange={(e) => setFormData({...formData, submittedVolume: parseFloat(e.target.value)})}
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
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="units">units</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Optional notes or handling instructions..." 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">Add Material</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
