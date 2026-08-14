"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save, Trash2 } from "lucide-react";

export function SubmitButton({
  label = "Save",
  pendingLabel = "Saving…",
  className = "btn-primary",
}: {
  label?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? pendingLabel : label}
    </button>
  );
}

/** A small inline action button used inside a <form action={...}>. */
export function ActionButton({
  label,
  pendingLabel,
  className = "btn-ghost",
  confirm,
  icon,
  children,
}: {
  label: string;
  pendingLabel?: string;
  className?: string;
  confirm?: string;
  icon?: "trash";
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      aria-label={label || undefined}
      title={label || undefined}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {icon === "trash" && <Trash2 className="h-4 w-4" />}
      {children}
      {pending ? pendingLabel ?? label : label}
    </button>
  );
}
