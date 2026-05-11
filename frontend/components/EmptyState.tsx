import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">{title}</h2>
      <p className="text-zinc-400 text-center mb-8 max-w-md">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg,#2D9B83,#1d6b5b)',
            boxShadow: '0 0 24px rgba(45,155,131,0.3)',
          }}
        >
          {cta.label}
          <RiArrowRightLine />
        </Link>
      )}
    </div>
  );
}
