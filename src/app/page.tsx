"use client";

import * as React from "react";
import { Material, Transaction, TransactionType, Aliquot } from "@/app/lib/types";
import { InventorySummary } from "@/components/inventory/InventorySummary";
import { MaterialTable } from "@/components/inventory/MaterialTable";
import { AddMaterialForm } from "@/components/inventory/AddMaterialForm";
import { TransactionForm } from "@/components/inventory/TransactionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileDown, 
  FileUp, 
  Search, 
  History, 
  Database,
  FlaskConical,
  Filter,
  Plus,
  User,
  Layers,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MOCK_MATERIALS: Material[] = [
  {
    id: "1",
    name: "Sodium Chloride",
    project: "Alpha-Chem",
    lotNumber: "NaCl-2024-01",
    storageLocations: ["Shelf 12, Bin B"],
    concentration: "Analytical Grade",
    submissionDate: "2024-03-01",
    storageCondition: "Ambient",
    submittedVolume: 500,
    unit: "g",
    retainAmount: 0,
    retainUnit: "g",
    aliquots: [],
    currentQuantity: 420,
    labelInfo: "Handle with care",
    notes: "High purity batch"
  },
  {
    id: "2",
    name: "Buffer Solution pH 7.0",
    project: "Bio-React",
    lotNumber: "BUF-PH7-101",
    storageLocations: ["Fridge #4, Shelf 2"],
    concentration: "NIST Traceable",
    submissionDate: "2024-03-15",
    storageCondition: "4°C Fridge",
    submittedVolume: 1000,
    unit: "mL",
    retainAmount: 50,
    retainUnit: "mL",
    aliquots: [{ id: "a1", count: 10, size: 5, unit: "mL" }],
    currentQuantity: 0,
    labelInfo: "Light sensitive",
    notes: "Calibration standard"
  }
];

export default function LabInventoryDashboard() {
  const [view, setView] = React.useState<'dashboard' | 'add' | 'edit' | 'transaction'>('dashboard');
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeMaterial, setActiveMaterial] = React.useState<Material | null>(null);
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const { toast } = useToast();

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedMaterials = localStorage.getItem("lab_materials");
    const savedTransactions = localStorage.getItem("lab_transactions");
    
    if (savedMaterials) {
      const parsed = JSON.parse(savedMaterials);
      const migrated = parsed.map((m: any) => ({
        ...m,
        storageLocations: Array.isArray(m.storageLocations) ? m.storageLocations : (m.storageLocation ? [m.storageLocation] : []),
        retainAmount: m.retainAmount ?? 0,
        retainUnit: m.retainUnit ?? m.unit ?? "mL",
        aliquots: Array.isArray(m.aliquots) ? m.aliquots : []
      }));
      setMaterials(migrated);
    } else {
      setMaterials(MOCK_MATERIALS);
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lab_materials", JSON.stringify(materials));
      localStorage.setItem("lab_transactions", JSON.stringify(transactions));
    }
  }, [materials, transactions, isLoaded]);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lotNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveMaterial = (data: Material | Omit<Material, 'id'>) => {
    if ('id' in data) {
      setMaterials(prev => prev.map(m => m.id === data.id ? data : m));
      toast({
        title: "Material Updated",
        description: `${data.name} specifications have been saved.`
      });
    } else {
      const newMaterial: Material = {
        ...data,
        id: Math.random().toString(36).substr(2, 9)
      };
      setMaterials([newMaterial, ...materials]);
      toast({
        title: "Material Added",
        description: `${data.name} has been successfully registered.`
      });
    }
    setView('dashboard');
    setEditingMaterial(null);
  };

  const handleOpenTransaction = (material: Material) => {
    setActiveMaterial(material);
    setView('transaction');
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setView('edit');
  };

  const handleSaveTransaction = (data: { 
    type: TransactionType; 
    quantity: number; 
    unit: string;
    timestamp: string;
    recipient: string; 
    aliquots: Aliquot[]; 
    notes: string 
  }) => {
    if (!activeMaterial) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: activeMaterial.id,
      materialName: activeMaterial.name,
      lotNumber: activeMaterial.lotNumber,
      type: data.type,
      quantity: data.quantity,
      unit: data.unit,
      timestamp: data.timestamp,
      recordedAt: new Date().toLocaleString(),
      recipient: data.recipient,
      aliquots: data.aliquots,
      notes: data.notes
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        let newQty = m.currentQuantity;
        if (data.type === 'consumption') newQty -= data.quantity;
        else if (data.type === 'addition') newQty += data.quantity;
        else if (data.type === 'adjustment') newQty = data.quantity;
        return { ...m, currentQuantity: Math.max(0, newQty) };
      }
      return m;
    }));

    toast({
      title: "Transaction Recorded",
      description: `Stock level updated for ${activeMaterial.name}.`
    });
    setView('dashboard');
    setActiveMaterial(null);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    // 1. Revert the quantity on the material
    setMaterials(prev => prev.map(m => {
      if (m.id === transaction.materialId) {
        let restoredQty = m.currentQuantity;
        if (transaction.type === 'consumption') {
          restoredQty += transaction.quantity;
        } else if (transaction.type === 'addition') {
          restoredQty -= transaction.quantity;
        }
        return { ...m, currentQuantity: Math.max(0, restoredQty) };
      }
      return m;
    }));

    // 2. Remove from transaction list
    setTransactions(prev => prev.filter(t => t.id !== transaction.id));

    toast({
      title: "Transaction Deleted",
      description: `Inventory for ${transaction.materialName} has been restored.`
    });
  };

  if (!isLoaded) return null;

  if (view === 'add' || view === 'edit') {
    return (
      <AddMaterialForm 
        initialData={editingMaterial || undefined}
        onSave={handleSaveMaterial} 
        onCancel={() => {
          setView('dashboard');
          setEditingMaterial(null);
        }} 
      />
    );
  }

  if (view === 'transaction' && activeMaterial) {
    return (
      <TransactionForm 
        material={activeMaterial}
        onSave={handleSaveTransaction}
        onCancel={() => {
          setView('dashboard');
          setActiveMaterial(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
              <FlaskConical className="h-8 w-8" />
              Lab Inventory Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Precision material management and audit logging system.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <FileUp className="mr-2 h-4 w-4" /> Import Excel
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button onClick={() => setView('add')} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Material
            </Button>
          </div>
        </div>

        <InventorySummary materials={materials} transactions={transactions} />

        <Tabs defaultValue="inventory" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Current Inventory
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials, projects, lot #..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="inventory" className="animate-in fade-in duration-500">
            <MaterialTable 
              materials={filteredMaterials} 
              onAddTransaction={handleOpenTransaction}
              onEdit={handleEditMaterial}
              onViewDetails={() => {}}
            />
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-500">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Lot #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Aliquots Given</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-32 text-muted-foreground">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-sm font-medium">{t.timestamp}</TableCell>
                        <TableCell className="font-semibold">{t.materialName}</TableCell>
                        <TableCell className="font-mono text-xs">{t.lotNumber}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              t.type === 'consumption' ? 'destructive' : 
                              t.type === 'addition' ? 'secondary' : 'outline'
                            }
                            className="text-[10px] uppercase px-1.5"
                          >
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {t.type === 'consumption' ? '-' : t.type === 'addition' ? '+' : ''}{t.quantity} {t.unit}
                        </TableCell>
                        <TableCell className="text-sm">
                          {t.recipient ? (
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 text-muted-foreground" />
                              {t.recipient}
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            {t.aliquots && t.aliquots.length > 0 ? (
                              t.aliquots.map((a) => (
                                <div key={a.id} className="flex items-center text-[10px] text-muted-foreground">
                                  <Layers className="h-2.5 w-2.5 mr-1" />
                                  {a.count} x {a.size} {a.unit}
                                </div>
                              ))
                            ) : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={t.notes}>
                          {t.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the transaction record and attempt to restore the material's available quantity. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteTransaction(t)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
