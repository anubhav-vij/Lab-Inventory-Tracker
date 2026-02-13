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
            <TableHead>Mapped Storage & Aliquots</TableHead>
            <TableHead>Lot #</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Submitted Vol</TableHead>
            <TableHead className="text-right">Retain</TableHead>
            <TableHead className="text-right">Available Quantity</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center h-32 text-muted-foreground">
                No materials found. Add your first material to get started.
              </TableCell>
            </TableRow>
          ) : (
            materials.map((m) => {
              const isDepleted = m.currentQuantity === 0;
              return (
                <TableRow 
                  key={m.id} 
                  className={cn(
                    "group transition-colors",
                    isDepleted 
                      ? "bg-destructive/10 hover:bg-destructive/15 border-destructive/20" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <TableCell>
                    <div className={cn("font-semibold", isDepleted && "text-destructive")}>{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.concentration}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "bg-secondary/10 border-secondary",
                      isDepleted && "border-destructive/30 text-destructive"
                    )}>
                      {m.project}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-3">
                      {m.storageEntries && m.storageEntries.length > 0 ? (
                        m.storageEntries.map((entry) => (
                          <div key={entry.id} className="space-y-1">
                            <div className="flex items-center text-xs font-bold text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1 shrink-0 text-primary" />
                              <span className="truncate max-w-[150px]">{entry.location}</span>
                            </div>
                            <div className="pl-4 space-y-0.5">
                              {entry.aliquots.map((a, i) => (
                                <div key={i} className="flex items-center text-[10px] text-muted-foreground">
                                  <Layers className="h-2.5 w-2.5 mr-1 shrink-0" />
                                  <span>{a.count} x {a.size} {a.unit}</span>
                                </div>
                              ))}
                              {entry.aliquots.length === 0 && (
                                <div className="text-[10px] text-muted-foreground italic">No aliquots</div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No mapping set</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{m.lotNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm whitespace-nowrap">
                      <Thermometer className="h-3 w-3 mr-1 text-muted-foreground" />
                      {m.storageCondition}
                    </div>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <span className="text-muted-foreground text-xs">
                      {Number(m.submittedVolume).toLocaleString()} {m.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <span className="text-muted-foreground text-xs">
                      {Number(m.retainAmount).toLocaleString()} {m.retainUnit}
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <span className={cn(
                      "font-bold text-base",
                      isDepleted ? "text-destructive animate-pulse" : "text-foreground"
                    )}>
                      {Number(m.currentQuantity).toLocaleString()} {m.unit}
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}