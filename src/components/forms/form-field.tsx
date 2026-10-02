import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const controlClassName =
  "h-11 bg-card text-base md:text-sm aria-invalid:border-destructive";

/**
 * Label + control + hint + error, wired with ids for screen readers.
 * The control is rendered by the caller via `children(props)`.
 */
export function FormField({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span className="text-brand" aria-hidden="true">*</span>
        ) : (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {children({
        id,
        name: id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function NativeSelect({
  options,
  placeholder = "Select…",
  className,
  ...props
}: React.ComponentProps<"select"> & {
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-input px-2.5 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        controlClassName,
        className,
      )}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
