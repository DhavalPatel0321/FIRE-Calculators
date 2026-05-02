import * as React from "react";

import { cn } from "@/lib/utils";

type SliderProps = Omit<
  React.ComponentProps<"input">,
  "defaultValue" | "max" | "min" | "onChange" | "type" | "value"
> & {
  defaultValue?: number[];
  max?: number;
  min?: number;
  onValueChange?: (value: number[]) => void;
  step?: number;
  value?: number[];
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  onValueChange,
  ...props
}: SliderProps) {
  const currentValue = Array.isArray(value)
    ? value[0]
    : Array.isArray(defaultValue)
      ? defaultValue[0]
      : min;

  return (
    <input
      type="range"
      data-slot="slider"
      value={currentValue}
      min={min}
      max={max}
      step={step}
      onChange={(event) => {
        onValueChange?.([event.currentTarget.valueAsNumber]);
      }}
      className={cn(
        "h-4 w-full cursor-pointer accent-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Slider };
