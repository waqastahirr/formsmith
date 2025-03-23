
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    id: string;
    label: string;
    description?: string;
  }[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, orientation = "horizontal", className, ...props }, ref) => {
    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          isVertical ? "flex flex-col space-y-4" : "flex flex-row items-center justify-between",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "flex",
                  isVertical ? "flex-row items-start" : "flex-col items-center"
                )}
              >
                <div className="relative flex">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "mt-2",
                    isVertical ? "ml-4" : "text-center"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    isVertical
                      ? "ml-5 h-full border-l-2 py-2"
                      : "flex-1 border-t-2 mx-2",
                    isCompleted
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = "Stepper";
