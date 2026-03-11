import { Card } from '@/components/ui';

export function TeamCard({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map((x) => x[0]).join('');
  return (
    <Card className="group transition hover:-translate-y-1 hover:border-cyan-300/40">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 font-semibold text-cyan-100">{initials}</div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-slate-300">{role}</p>
    </Card>
  );
}
