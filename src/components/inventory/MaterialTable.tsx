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
import { MoreHorizontal, ArrowRightLeft, Thermometer, MapPin, Edit2, Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MaterialTableProps {
  materials: Material[];
  onAddTransaction: (material: Material) => void;
  onEdit: (material: Material) => void;
  onViewDetails: (material: Material) => void;
}

export function MaterialTable({ materials, onAddTransaction, onEdit, onViewDetails }: MaterialTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Material Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Location(s)</TableHead>
            <TableHead>Lot #</TableHead>
            <TableHead>Aliquots</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Available Quantity</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
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
                  <div className="flex flex-col gap-1">
                    {m.storageLocations && m.storageLocations.length > 0 ? (
                      m.storageLocations.map((loc, i) => (
                        <div key={i} className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 shrink-0" />
                          <span className="truncate max-w-[120px]">{loc}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No location set</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{m.lotNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {m.aliquots && m.aliquots.length > 0 ? (
                      m.aliquots.map((a) => (
                        <div key={a.id} className="flex items-center text-xs text-muted-foreground">
                          <Layers className="h-3 w-3 mr-1 shrink-0" />
                          <span className="whitespace-nowrap">{a.count} x {a.size} {a.unit}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Thermometer className="h-3 w-3 mr-1 text-muted-foreground" />
                    {m.storageCondition}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "font-bold",
                    m.currentQuantity === 0 ? "text-destructive animate-pulse" : "text-foreground"
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
                      <DropdownMenuItem onClick={() => onEdit(m)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onAddTransaction(m)}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Record Transaction
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