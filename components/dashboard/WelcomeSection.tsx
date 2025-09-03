import { Card } from '@/components/ui/card';

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
}

export function WelcomeSection({ title, subtitle }: WelcomeSectionProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-3xl font-extrabold mb-2 tracking-tight">{title}</h2>
      <p className="text-blue-100 text-lg opacity-90">{subtitle}</p>
    </Card>
  );
}