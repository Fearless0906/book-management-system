import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
  onAddBook: () => void;
  onAddUser: () => void;
}

export function WelcomeSection({ title, subtitle, onAddBook, onAddUser }: WelcomeSectionProps) {
  return (
    <div className="p-8 rounded-2xl bg-gray-900/10 dark:bg-white/10 border border-white/20 backdrop-blur-lg">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={onAddBook} variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Book
          </Button>
          <Button onClick={onAddUser} variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-0">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
}
