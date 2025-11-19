"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { type MedicineResponse } from "@/lib/api/medicine";

interface MedicineSelectorProps {
  medicines: MedicineResponse[];
  value: string;
  onChange: (medicineId: string) => void;
  placeholder?: string;
}

export function MedicineSelector({
  medicines,
  value,
  onChange,
  placeholder = "Search medicine...",
}: MedicineSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedMedicine = medicines.find((m) => m.id.toString() === value);

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.generic_name?.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (medicineId: number) => {
    onChange(medicineId.toString());
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-700 cursor-pointer flex items-center justify-between"
      >
        <span className={selectedMedicine ? "" : "text-muted-foreground"}>
          {selectedMedicine
            ? `${selectedMedicine.name} - ${selectedMedicine.generic_name || "N/A"}`
            : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b dark:border-zinc-700">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full"
            />
          </div>

          <div className="overflow-y-auto max-h-64">
            {filteredMedicines.length === 0 ? (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No medicine found
              </div>
            ) : (
              filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  onClick={() => handleSelect(medicine.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                    value === medicine.id.toString()
                      ? "bg-blue-50 dark:bg-blue-950/20"
                      : ""
                  }`}
                >
                  <div className="font-medium">{medicine.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {medicine.generic_name || "N/A"} • {medicine.strength}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
