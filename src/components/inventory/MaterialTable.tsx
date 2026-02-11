"use client";

import * as React from "react";
import { Material } from "@/app/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowRightLeft, Package, Thermometer, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaterialTableProps {
  materials: Material[];
  onAddTransaction: (material: Material) => void;
  onViewDetails: (material: Material) => void;
}

export function MaterialTable({ materials, onAddTransaction, onViewDetails }: MaterialTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Material Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Lot #</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                No materials found. Add your first material to get started.
              </TableCell>
            </TableRow>
          ) : (
            materials.map((m) => (
              <TableRow key={m.id} className="group hover:bg-muted/50">
                <TableCell>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.concentration}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-secondary/10 border-secondary">
                    {m.project}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    {m.storageLocation}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{m.lotNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Thermometer className="h-3 w-3 mr-1 text-muted-foreground" />
                    {m.storageCondition}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-bold",
                    m.currentQuantity <= (m.submittedVolume * 0.1) ? "text-destructive" : "text-foreground"
                  )}>
                    {m.currentQuantity} {m.unit}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(m)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddTransaction(m)}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Record Transaction
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Decommission
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import { cn } from "@/lib/utils";
