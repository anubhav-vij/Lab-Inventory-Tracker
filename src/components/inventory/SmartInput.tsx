"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { validateAndAutocomplete } from "@/ai/flows/form-validation-autocomplete";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  onValueChange?: (value: string) => void;
}

export function SmartInput({ fieldName, className, onValueChange, ...props }: SmartInputProps) {
  const [value, setValue] = React.useState(props.defaultValue?.toString() || "");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  const performValidation = async (currentValue: string) => {
    if (!currentValue.trim()) {
      setSuggestions([]);
      setIsValid(null);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const result = await validateAndAutocomplete({
        fieldName,
        inputValue: currentValue,
      });
      setSuggestions(result.suggestions);
      setIsValid(result.isValid);
      setError(result.errorMessage || null);
    } catch (e) {
      console.error("AI Validation Error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    onValueChange?.(newVal);
    setShowSuggestions(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      performValidation(newVal);
    }, 500);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setValue(suggestion);
    onValueChange?.(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    performValidation(suggestion);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          {...props}
          value={value}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          className={cn(
            "pr-10",
            isValid === true && "border-green-500/50 focus-visible:ring-green-500/30",
            isValid === false && "border-destructive/50 focus-visible:ring-destructive/30",
            className
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!loading && isValid === true && <Check className="h-4 w-4 text-green-500" />}
          {!loading && isValid === false && <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
      </div>

      {error && isValid === false && (
        <p className="text-xs text-destructive mt-1 font-medium">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-auto py-1 animate-in fade-in zoom-in-95 duration-200">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onMouseDown={() => handleSelectSuggestion(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
