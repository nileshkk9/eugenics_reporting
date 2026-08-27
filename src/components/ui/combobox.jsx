import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "../../lib/utils";

const getOptionLabel = (opt) => {
  if (opt == null) return "";
  if (typeof opt === "string" || typeof opt === "number") return String(opt);
  if (typeof opt === "object") {
    return String(opt.label ?? opt.value ?? opt.name ?? "");
  }
  return String(opt);
};

/**
 * Combobox that supports both free-text input and dropdown selection.
 * Typed values are accepted as-is; selecting an option updates the input.
 */
function Combobox({ value, onChange, options = [], placeholder = "Search...", className }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (val) => {
    setInputValue(val);
    onChange(val);
  };

  const handleSelect = (selectedValue) => {
    const opt = options.find(
      (o) => getOptionLabel(o).toLowerCase() === selectedValue.toLowerCase()
    );
    const label = opt ? getOptionLabel(opt) : selectedValue;
    setInputValue(label);
    onChange(label);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal h-10 text-left", className)}
          onClick={() => setOpen(true)}
        >
          <span className={cn("truncate", !inputValue && "text-gray-400")}>
            {inputValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput
              value={inputValue}
              onValueChange={handleInputChange}
              placeholder={placeholder}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <CommandEmpty className="py-2 px-3 text-sm text-gray-500">
                {inputValue ? `Using "${inputValue}"` : "No results."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((opt, i) => {
                  const label = getOptionLabel(opt);
                  return (
                    <CommandItem
                      key={i}
                      value={label}
                      onSelect={handleSelect}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          inputValue === label ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
