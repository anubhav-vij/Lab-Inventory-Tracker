
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowUpRight, Activity, AlertTriangle } from "lucide-react";
import { Material, Transaction } from "@/app/lib/types";

interface InventorySummaryProps {
  materials: Material[];
  transactions: Transaction[];
}

export function InventorySummary({ materials, transactions }: InventorySummaryProps) {
  const totalItems = materials.length;
  const depletedItems = materials.filter(m => m.currentQuantity === 0).length;
  
  // Calculate materials added in the last 7 days
  const recentAdditions = materials.filter(m => {
    const subDate = new Date(m.submissionDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - subDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  // Calculate transactions recorded today
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyTransactions = transactions.filter(t => t.timestamp === todayStr).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">In active inventory</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low/No Stock</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{depletedItems}</div>
          <p className="text-xs text-muted-foreground">Items at 0 quantity</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentAdditions}</div>
          <p className="text-xs text-muted-foreground">In the last 7 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Active Logs</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyTransactions}</div>
          <p className="text-xs text-muted-foreground">Transactions for {todayStr}</p>
        </CardContent>
      </Card>
    </div>
  );
}
