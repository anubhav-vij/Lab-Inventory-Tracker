"use client";

import * as React from "react";
import { Material, Transaction, TransactionType, Aliquot, StorageEntry, MaterialUnit } from "@/app/lib/types";
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
  MapPin,
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
    storageEntries: [
      {
        id: "loc1",
        location: "F81*S1*R5*B1",
        aliquots: [
          { id: "a1", count: 21, size: 1, unit: "mL" },
          { id: "a2", count: 1, size: 40, unit: "mL" },
          { id: "a3", count: 8, size: 0.5, unit: "mL" }
        ]
      }
    ],
    concentration: "Analytical Grade",
    submissionDate: "2024-03-01",
    storageCondition: "Ambient",
    submittedVolume: 500,
    unit: "mL",
    retainAmount: 10,
    retainUnit: "mL",
    currentQuantity: 65,
    labelInfo: "Handle with care",
    notes: "High purity batch"
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

  React.useEffect(() => {
    const savedMaterials = localStorage.getItem("lab_materials");
    const savedTransactions = localStorage.getItem("lab_transactions");
    
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    } else {
      setMaterials(MOCK_MATERIALS);
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    setIsLoaded(true);
  }, []);

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

  const filteredTransactions = transactions.filter(t => 
    t.materialName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveMaterial = (data: Material | Omit<Material, 'id'>) => {
    if ('id' in data) {
      setMaterials(prev => prev.map(m => m.id === data.id ? data as Material : m));
      toast({
        title: "Material Updated",
        description: `${data.name} specifications have been saved.`
      });
    } else {
      const newMaterial: Material = {
        ...data,
        id: Math.random().toString(36).substr(2, 9)
      } as Material;
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
    storageEntries: StorageEntry[]; 
    notes: string 
  }) => {
    if (!activeMaterial) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: activeMaterial.id,
      materialName: activeMaterial.name,
      lotNumber: activeMaterial.lotNumber,
      type: data.type,
      quantity: Number(data.quantity),
      unit: data.unit,
      timestamp: data.timestamp,
      recordedAt: new Date().toLocaleString(),
      recipient: data.recipient,
      storageEntries: data.storageEntries || [],
      notes: data.notes
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setMaterials(prev => prev.map(m => {
      if (m.id === activeMaterial.id) {
        const updatedEntries = JSON.parse(JSON.stringify(m.storageEntries)) as StorageEntry[];
        
        if (data.storageEntries && Array.isArray(data.storageEntries)) {
          data.storageEntries.forEach(tEntry => {
            let mEntry = updatedEntries.find(e => e.location.trim() === tEntry.location.trim());
            
            if (mEntry) {
              tEntry.aliquots.forEach(tAliquot => {
                let mAliquot = mEntry!.aliquots.find(a => 
                  Number(a.size) === Number(tAliquot.size) && a.unit === tAliquot.unit
                );

                if (mAliquot) {
                  if (data.type === 'consumption') {
                    mAliquot.count = Math.max(0, Number(mAliquot.count) - Number(tAliquot.count));
                  } else if (data.type === 'addition') {
                    mAliquot.count = Number(mAliquot.count) + Number(tAliquot.count);
                  }
                } else if (data.type === 'addition') {
                  mEntry!.aliquots.push({ 
                    ...tAliquot, 
                    id: Math.random().toString(36).substr(2, 9),
                    count: Number(tAliquot.count), 
                    size: Number(tAliquot.size) 
                  });
                }
              });
            } else if (data.type === 'addition') {
              updatedEntries.push({ 
                ...tEntry,
                id: Math.random().toString(36).substr(2, 9),
                aliquots: tEntry.aliquots.map(a => ({ 
                  ...a, 
                  id: Math.random().toString(36).substr(2, 9),
                  count: Number(a.count), 
                  size: Number(a.size) 
                }))
              });
            }
          });
        }

        const newTotal = updatedEntries.reduce((sum, entry) => {
          return sum + entry.aliquots.reduce((aSum, a) => aSum + (Number(a.count) * Number(a.size)), 0);
        }, 0);

        return { ...m, storageEntries: updatedEntries, currentQuantity: Number(newTotal) };
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
    setMaterials(prev => prev.map(m => {
      if (m.id === transaction.materialId) {
        const updatedEntries = JSON.parse(JSON.stringify(m.storageEntries)) as StorageEntry[];
        
        if (transaction.storageEntries && Array.isArray(transaction.storageEntries)) {
          transaction.storageEntries.forEach(tEntry => {
            let mEntry = updatedEntries.find(e => e.location.trim() === tEntry.location.trim());
            if (mEntry) {
              tEntry.aliquots.forEach(tAliquot => {
                let mAliquot = mEntry!.aliquots.find(a => 
                  Number(a.size) === Number(tAliquot.size) && a.unit === tAliquot.unit
                );
                if (mAliquot) {
                  if (transaction.type === 'consumption') {
                    mAliquot.count = Number(mAliquot.count) + Number(tAliquot.count);
                  } else if (transaction.type === 'addition') {
                    mAliquot.count = Math.max(0, Number(mAliquot.count) - Number(tAliquot.count));
                  }
                }
              });
            }
          });
        }

        const newTotal = updatedEntries.reduce((sum, entry) => {
          return sum + entry.aliquots.reduce((aSum, a) => aSum + (Number(a.count) * Number(a.size)), 0);
        }, 0);

        return { ...m, storageEntries: updatedEntries, currentQuantity: Number(newTotal) };
      }
      return m;
    }));

    setTransactions(prev => prev.filter(t => t.id !== transaction.id));
    toast({
      title: "Transaction Deleted",
      description: "Inventory levels have been restored."
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
                Material Inventory
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Transactions
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
                    <TableHead>Storage & Aliquots Involved</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-32 text-muted-foreground">
                        {searchQuery ? "No transactions match your search." : "No transactions recorded yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((t) => (
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
                          <div className="flex flex-col gap-3">
                            {t.storageEntries && t.storageEntries.length > 0 ? (
                              t.storageEntries.map((entry) => (
                                <div key={entry.id} className="space-y-1">
                                  <div className="flex items-center text-[10px] font-bold text-muted-foreground">
                                    <MapPin className="h-2.5 w-2.5 mr-1 text-primary" />
                                    {entry.location}
                                  </div>
                                  <div className="pl-3.5 space-y-0.5">
                                    {entry.aliquots.map((a, i) => (
                                      <div key={i} className="flex items-center text-[9px] text-muted-foreground">
                                        <Layers className="h-2 w-2 mr-1" />
                                        {a.count} x {a.size} {a.unit}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={t.notes}>
                          {t.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Transaction Log?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the transaction record and reverse the inventory change. 
                                  Consumed volume will be added back, or added volume will be removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDeleteTransaction(t)}
                                >
                                  Confirm Delete
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
