import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import useFetch from "@/helpers/useFetch";
import { fetchBookStatusDistribution } from "@/lib/api";
import { Loader2 } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function BookAvailabilityChart() {
  const { data: distribution, loading, error } = useFetch(fetchBookStatusDistribution);

  const chartData = distribution?.map(item => ({ name: item.status, value: item.count })) || [];

  return (
    <Card className="p-6 rounded-2xl border border-white/20 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Book Availability</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load book availability data.</div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-gray-500">No book availability data found.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
