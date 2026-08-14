import Link from "next/link";
import { STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white p-5 shadow-card", className)}>
      {children}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
  required,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-green-600">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

const inputBase =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-navy placeholder:text-stone-400 focus:border-green focus:outline-none focus:ring-1 focus:ring-green";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "min-h-[120px]", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputBase, "appearance-none", props.className)} />;
}

export function Checkbox({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-stone-200 p-3 hover:border-green">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-[#00A99D]" />
      <span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {hint && <span className="block text-xs text-stone-400">{hint}</span>}
      </span>
    </label>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-700",
  DRAFT: "bg-stone-100 text-stone-600",
  PENDING: "bg-navy-50 text-navy",
  APPROVED: "bg-green-50 text-green-700",
  SCHEDULED: "bg-navy-50 text-navy",
  ARCHIVED: "bg-stone-100 text-stone-500",
  REJECTED: "bg-stone-200 text-stone-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[status] ?? "bg-stone-100 text-stone-600")}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({ title, hint, actionHref, actionLabel }: {
  title: string; hint?: string; actionHref?: string; actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
      <p className="font-medium text-navy">{title}</p>
      {hint && <p className="mt-1 text-sm text-stone-500">{hint}</p>}
      {actionHref && actionLabel && (
        <Link href={actionHref} className="btn-primary mt-4">{actionLabel}</Link>
      )}
    </div>
  );
}
