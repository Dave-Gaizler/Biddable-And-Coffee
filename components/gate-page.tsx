'use client';

import { FormEvent, useState } from 'react';
import { LockKeyhole, Sparkles } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

export function GatePage({ onUnlock }: { onUnlock: () => void }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answer.trim().toLowerCase() === 'biddable') {
      sessionStorage.setItem('bac-unlocked', 'true');
      onUnlock();
      return;
    }

    setError('Not quite. Try the transaction type our team can’t stop talking about ☕');
  };

  return (
    <main className="soft-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute -left-20 top-20 h-72 w-72 animate-pulseSlow rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-16 h-80 w-80 animate-drift rounded-full bg-violet-500/20 blur-3xl" />
      <Card className="relative z-10 w-full max-w-2xl border-cyan-300/30 bg-slate-900/70 p-8 md:p-12">
        <div className="mb-6 flex items-center gap-3 text-cyan-300">
          <LockKeyhole className="h-5 w-5" />
          <p className="text-sm uppercase tracking-[0.3em]">Internal Access</p>
        </div>
        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
          What&apos;s the fastest growing <span className="text-cyan-300">Transaction Type</span> at Disney?
        </h1>
        <p className="mt-4 text-slate-300">Enter the passphrase to unlock the Biddable and Coffee market pulse terminal.</p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." aria-label="Password style answer" />
          <Button type="submit" className="w-full">Enter Dashboard</Button>
        </form>
        {error ? (
          <p className="mt-3 flex items-center gap-2 text-sm text-rose-300"><Sparkles className="h-4 w-4" />{error}</p>
        ) : (
          <p className="mt-3 text-sm text-slate-400">Hint: it starts with <span className="font-semibold text-cyan-300">bid...</span></p>
        )}
      </Card>
    </main>
  );
}
