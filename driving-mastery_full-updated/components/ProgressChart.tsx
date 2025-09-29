import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QuizResult } from '../types';
import { BookOpenIcon } from './icons';

interface ProgressChartProps {
  data: QuizResult[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-200 rounded-md shadow-lg">
                <p className="font-bold text-gray-800">{`${label}`}</p>
                <p className="text-sm text-brand-blue">{`Score: ${payload[0].value}%`}</p>
                <p className="text-xs text-gray-500">{`${payload[0].payload.correct} / ${payload[0].payload.total} correct`}</p>
            </div>
        );
    }
    return null;
};


const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
    const chartData = data
        .filter(item => item.total > 0)
        .map(item => ({
            name: item.category,
            percentage: Math.round((item.correct / item.total) * 100),
            correct: item.correct,
            total: item.total,
        }))
        .sort((a, b) => a.percentage - b.percentage);

    if (chartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 text-gray-500 min-h-[250px]">
                <BookOpenIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h4 className="font-semibold text-lg text-gray-600">No quiz data yet</h4>
                <p className="max-w-xs">Complete a quiz, and your progress breakdown by topic will appear here.</p>
            </div>
        )
    }

    const getBarColor = (percentage: number) => {
        if (percentage >= 86) return '#10B981'; // brand-green (Pass mark)
        if (percentage >= 50) return '#F59E0B'; // A warning yellow
        return '#EF4444'; // brand-red (Fail)
    };
    
    const chartHeight = chartData.length * 40 + 40;

    return (
        <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                        top: 5, right: 30, left: 30, bottom: 5,
                    }}
                    barSize={20}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} fontSize={12} />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={120} 
                        tick={{ fontSize: 12 }} 
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}/>
                    <Bar dataKey="percentage" radius={[0, 10, 10, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;