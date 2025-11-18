"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full"
    />
  );
}
