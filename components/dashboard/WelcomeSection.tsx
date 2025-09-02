import { Card } from '@/components/ui/card';

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
}

export function WelcomeSection({ title, subtitle }: WelcomeSectionProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-blue-100">{subtitle}</p>
    </Card>
  );
}