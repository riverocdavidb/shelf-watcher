
import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MovementFormInputs } from "./StockMovementSchema";

interface DatePickerFieldProps {
  control: Control<MovementFormInputs>;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ control }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Date</label>
      <Controller
        name="date"
        control={control}
        render={({ field }) => {
          let inputValue =
            field.value instanceof Date
              ? format(field.value, "MM/dd/yyyy")
              : typeof field.value === "string"
                ? field.value
                : "";
          return (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <div className="relative flex">
                <Input
                  type="text"
                  className="pr-10 font-mono"
                  placeholder="MM/DD/YYYY"
                  value={inputValue}
                  onChange={e => {
                    field.onChange(e.target.value);
                    if (
                      e.target.value.length === 10 &&
                      /^\d{2}\/\d{2}\/\d{4}$/.test(e.target.value)
                    ) {
                      const maybeDate = parse(e.target.value, "MM/dd/yyyy", new Date());
                      if (isValid(maybeDate)) {
                        setCalendarOpen(false);
                      }
                    }
                  }}
                  onFocus={() => setCalendarOpen(false)}
                />
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="absolute right-1 top-[3px] p-2 h-7 w-7"
                    tabIndex={-1}
                  >
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
              </div>
              <PopoverContent className="w-auto p-0 mt-2" side="bottom" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value instanceof Date
                      ? field.value
                      : typeof field.value === "string"
                        ? (() => {
                            const d = parse(field.value, "MM/dd/yyyy", new Date());
                            return isValid(d) ? d : undefined;
                          })()
                        : undefined
                  }
                  onSelect={date => {
                    setCalendarOpen(false);
                    if (date) {
                      field.onChange(date);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
};

export default DatePickerField;
