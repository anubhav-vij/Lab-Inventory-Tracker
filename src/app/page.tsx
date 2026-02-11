"use client";

import * as React from "react";
import { Material, Transaction, TransactionType } from "@/app/lib/types";
import { InventorySummary } from "@/components/inventory/InventorySummary";
import { MaterialTable } from "@/components/inventory/MaterialTable";
import { AddMaterialDialog } from "@/components/inventory/AddMaterialDialog";
import { TransactionDialog } from "@/components/inventory/TransactionDialog";
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
  Filter
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

const MOCK_MATERIALS: Material[] = [
  {
    id: "1",
    name: "Sodium Chloride",
    project: "Alpha-Chem",
    lotNumber: "NaCl-2024-01",
    storageLocation: "Shelf 12, Bin B",
    concentration: "Analytical Grade",
    submissionDate: "2024-03-01",
    storageCondition: "Ambient",
    submittedVolume: 500,
    unit: "g",
    currentQuantity: 420,
    labelInfo: "Handle with care",
    notes: "High purity batch"
  },
  {
    id: "2",
    name: "Buffer Solution pH 7.0",
    project: "Bio-React",
    lotNumber: "BUF-PH7-101",
    storageLocation: "Fridge #4, Shelf 2",
    concentration: "NIST Traceable",
    submissionDate: "2024-03-15",
    storageCondition: "4°C Fridge",
    submittedVolume: 1000,
    unit: "mL",
    currentQuantity: 85,
    labelInfo: "Low stock alert",
    notes: "Calibration standard"
  }
];

export default function LabInventoryDashboard() {
  const [materials, setMaterials] = React.useState<Material[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeMaterial, setActiveMaterial] = React.useState<Material | null>(null);
  const [isTransactionOpen, setIsTransactionOpen] = React.useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
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

  // Save to localStorage on changes
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lab_materials", JSON.stringify(materials));
      localStorage.setItem("lab_transactions", JSON.stringify(transactions));
    }
  }, [materials, transactions, isLoaded]);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMaterial = (data: Omit<Material, 'id' | 'currentQuantity'>) => {
    const newMaterial: Material = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      currentQuantity: data.submittedVolume
    };
    setMaterials([newMaterial, ...materials]);
    toast({
      title: "Material Added",
      description: `${data.name} has been successfully registered.`
    });
  };

  const handleOpenTransaction = (material: Material) => {
    setActiveMaterial(material);
    setIsTransactionOpen(true);
  };

  const handleSaveTransaction = (data: { type: TransactionType; quantity: number; notes: string }) => {
    if (!activeMaterial) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: activeMaterial.id,
      materialName: activeMaterial.name,
      type: data.type,
      quantity: data.quantity,
      unit: activeMaterial.unit,
      timestamp: new Date().toLocaleString(),
      notes: data.notes
    };

    setTransactions([newTransaction, ...transactions]);

    // Update quantities
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
  };

  const handleMockImport = () => {
    toast({
      title: "Excel Import Mocked",
      description: "Validated 14 entries. Updated balances for 4 materials."
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
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
            <Button variant="outline" onClick={handleMockImport}>
              <FileUp className="mr-2 h-4 w-4" /> Import Excel
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <AddMaterialDialog onSave={handleAddMaterial} />
          </div>
        </div>

        {/* Summary Stats */}
        <InventorySummary materials={materials} />

        {/* Main Content */}
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
                  placeholder="Search materials, projects..."
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
              onViewDetails={() => {}}
            />
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-500">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs text-muted-foreground">{t.timestamp}</TableCell>
                        <TableCell className="font-medium">{t.materialName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              t.type === 'consumption' ? 'destructive' : 
                              t.type === 'addition' ? 'secondary' : 'outline'
                            }
                          >
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {t.type === 'consumption' ? '-' : '+'}{t.quantity} {t.unit}
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{t.notes}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TransactionDialog 
        material={activeMaterial}
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}
