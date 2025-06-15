
"use client"
// This is a very basic placeholder for a TimePicker.
// For a production app, you'd use a dedicated library or a more robust custom component.
// ShadCN UI doesn't have a native TimePicker as of my last knowledge update.
// This example simply uses <Input type="time" />.

import * as React from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TimePickerProps extends Omit<InputProps, 'type'> {
  label?: string;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className={cn("grid gap-1", className)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <Input
          id={inputId}
          ref={ref}
          type="time"
          className={cn("w-full", className)}
          {...props}
        />
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"

export { TimePicker }
