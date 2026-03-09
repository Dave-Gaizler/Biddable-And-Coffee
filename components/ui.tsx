import { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass rounded-2xl p-5 shadow-glass', className)} {...props} />;
}

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-2 text-slate-100 outline-none ring-cyan-400/60 placeholder:text-slate-400 focus:ring-2', className)}
      {...props}
    />
  );
}
