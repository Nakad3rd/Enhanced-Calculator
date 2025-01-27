import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "@/components/ui/card";
import type { Course } from "@/lib/utils";
import { calculateGPA } from "@/lib/utils";

interface CategoryPerformanceProps {
  courses: Course[];
}

export const CategoryPerformance = ({ courses }: CategoryPerformanceProps) => {
  const categoryGroups = courses.reduce((acc, course) => {
    const category = course.name.split(' ')[0] || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const data = Object.entries(categoryGroups).map(([category, courses]) => ({
    category,
    gpa: calculateGPA(courses),
    courses: courses.length,
  }));

  return (
    <Card className="p-6 bg-gradient-professional border border-primary/20">
      <h3 className="text-xl font-semibold text-white mb-4">Performance Analysis by Category</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="category" 
              stroke="#E4E4E7"
              tick={{ fill: '#E4E4E7' }}
              axisLine={{ stroke: '#E4E4E7' }}
            />
            <YAxis 
              domain={[0, 4]}
              stroke="#E4E4E7"
              tick={{ fill: '#E4E4E7' }}
              axisLine={{ stroke: '#E4E4E7' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 30, 46, 0.9)',
                border: '1px solid rgba(134, 168, 231, 0.2)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#E4E4E7' }}
              itemStyle={{ color: '#E4E4E7' }}
            />
            <Legend 
              wrapperStyle={{ color: '#E4E4E7' }}
            />
            <Bar 
              name="GPA"
              dataKey="gpa" 
              fill="#86A8E7"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};