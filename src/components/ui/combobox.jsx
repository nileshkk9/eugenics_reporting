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
    return String(opt.label ?? opt.name ?? opt.value ?? "");
  }
  return String(opt);
};

const getOptionValue = (opt) => {
  if (opt == null) return "";
  if (typeof opt === "string" || typeof opt === "number") return String(opt);
  if (typeof opt === "object") {
    return String(opt.value ?? opt.id ?? getOptionLabel(opt));
  }
  return String(opt);
};

/**
 * Combobox that supports both free-text input and dropdown selection.
 * Typed values are accepted as-is unless allowCustom is false.
 */
function Combobox({
  value,
  onChange,
  options = [],
  placeholder = "Search...",
  className,
  allowCustom = true,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (allowCustom) setInputValue(value || "");
  }, [value, allowCustom]);

  React.useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const selectedOption = options.find((opt) => getOptionValue(opt) === String(value ?? ""));
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : "";
  const filterText = allowCustom ? inputValue : search;

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(filterText.toLowerCase())
  );

  const handleInputChange = (val) => {
    if (allowCustom) {
      setInputValue(val);
      onChange(val);
    } else {
      setSearch(val);
    }
  };

  const handleSelect = (selectedValue) => {
    const opt = options.find(
      (o) =>
        getOptionLabel(o).toLowerCase() === selectedValue.toLowerCase() ||
        getOptionValue(o).toLowerCase() === selectedValue.toLowerCase()
    );
    if (allowCustom) {
      const label = opt ? getOptionLabel(opt) : selectedValue;
      setInputValue(label);
      onChange(label);
    } else if (opt) {
      onChange(getOptionValue(opt));
    }
    setOpen(false);
  };

  const buttonLabel = allowCustom ? inputValue : selectedLabel;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal h-10 text-left", className)}
          onClick={() => setOpen(true)}
        >
          <span className={cn("truncate", !buttonLabel && "text-gray-400")}>
            {buttonLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <CommandInput
              value={filterText}
              onValueChange={handleInputChange}
              placeholder={placeholder}
              className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <CommandEmpty className="py-2 px-3 text-sm text-gray-500">
                {allowCustom && inputValue ? `Using "${inputValue}"` : "No results."}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((opt, i) => {
                  const label = getOptionLabel(opt);
                  const optionValue = getOptionValue(opt);
                  const isSelected = allowCustom
                    ? inputValue === label
                    : String(value ?? "") === optionValue;
                  return (
                    <CommandItem
                      key={optionValue || i}
                      value={`${label} ${optionValue}`}
                      onSelect={() => handleSelect(optionValue)}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 aria-selected:bg-gray-100"
                    >
                      <Check className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
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
