import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "@/components/ui/card";
import type { Semester } from "@/lib/utils";
import { calculateGPA } from "@/lib/utils";

interface CGPATrendChartProps {
  semesters: Semester[];
  targetCGPA?: number;
}

export const CGPATrendChart = ({ semesters, targetCGPA }: CGPATrendChartProps) => {
  const data = semesters.map(semester => ({
    name: semester.name,
    gpa: calculateGPA(semester.courses),
  }));

  const minGPA = Math.min(...data.map(d => d.gpa), targetCGPA || Infinity);
  const maxGPA = Math.max(...data.map(d => d.gpa), targetCGPA || -Infinity);
  const yAxisDomain = [Math.max(0, minGPA - 0.5), Math.min(4.0, maxGPA + 0.5)];

  return (
    <Card className="p-6 bg-gradient-professional border border-primary/20 animate-fade-in">
      <h3 className="text-xl font-semibold text-white mb-4">CGPA Trend Analysis</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#E4E4E7"
              tick={{ fill: '#E4E4E7' }}
              axisLine={{ stroke: '#E4E4E7' }}
            />
            <YAxis 
              domain={yAxisDomain}
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
            <Line
              name="GPA"
              type="monotone"
              dataKey="gpa"
              stroke="#86A8E7"
              strokeWidth={3}
              dot={{ fill: '#86A8E7', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#91A7FF' }}
            />
            {targetCGPA && (
              <Line
                name="Target CGPA"
                type="monotone"
                dataKey={() => targetCGPA}
                stroke="#B4C6FC"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};