
import React from 'react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NorthChartProps {
  dateOfBirth: string;
  location: string;
  birthTime?: string;
  gender?: string;
}

const NorthChart: React.FC<NorthChartProps> = ({ dateOfBirth, location, birthTime, gender }) => {
  // These would normally be calculated based on the birth details
  // For now, we'll use placeholder data that resembles a North/Vedic chart
  const generateChartData = () => {
    // Parse the date of birth to get some dynamic data
    const dob = new Date(dateOfBirth);
    const day = dob.getDate();
    const month = dob.getMonth() + 1;
    
    // Generate semi-realistic house positions based on DOB
    return [
      { name: 'Aries', value: 30, sign: 'Aries', house: (month % 12) + 1, fill: '#FF5733' },
      { name: 'Taurus', value: 30, sign: 'Taurus', house: ((month + 1) % 12) + 1, fill: '#33FF57' },
      { name: 'Gemini', value: 30, sign: 'Gemini', house: ((month + 2) % 12) + 1, fill: '#3357FF' },
      { name: 'Cancer', value: 30, sign: 'Cancer', house: ((month + 3) % 12) + 1, fill: '#F3FF33' },
      { name: 'Leo', value: 30, sign: 'Leo', house: ((month + 4) % 12) + 1, fill: '#FF33F3' },
      { name: 'Virgo', value: 30, sign: 'Virgo', house: ((month + 5) % 12) + 1, fill: '#33FFF3' },
      { name: 'Libra', value: 30, sign: 'Libra', house: ((month + 6) % 12) + 1, fill: '#DAF7A6' },
      { name: 'Scorpio', value: 30, sign: 'Scorpio', house: ((month + 7) % 12) + 1, fill: '#FFC300' },
      { name: 'Sagittarius', value: 30, sign: 'Sagittarius', house: ((month + 8) % 12) + 1, fill: '#C70039' },
      { name: 'Capricorn', value: 30, sign: 'Capricorn', house: ((month + 9) % 12) + 1, fill: '#900C3F' },
      { name: 'Aquarius', value: 30, sign: 'Aquarius', house: ((month + 10) % 12) + 1, fill: '#581845' },
      { name: 'Pisces', value: 30, sign: 'Pisces', house: ((month + 11) % 12) + 1, fill: '#2471A3' },
    ];
  };

  // Generate planet positions based on birth date
  const generatePlanetData = () => {
    const dob = new Date(dateOfBirth);
    const day = dob.getDate();
    
    return [
      { name: 'Sun', position: (day % 12), sign: getSignForPosition(day % 12) },
      { name: 'Moon', position: ((day + 2) % 12), sign: getSignForPosition((day + 2) % 12) },
      { name: 'Mercury', position: ((day + 4) % 12), sign: getSignForPosition((day + 4) % 12) },
      { name: 'Venus', position: ((day + 6) % 12), sign: getSignForPosition((day + 6) % 12) },
      { name: 'Mars', position: ((day + 8) % 12), sign: getSignForPosition((day + 8) % 12) },
      { name: 'Jupiter', position: ((day + 10) % 12), sign: getSignForPosition((day + 10) % 12) },
      { name: 'Saturn', position: ((day + 1) % 12), sign: getSignForPosition((day + 1) % 12) },
      { name: 'Rahu', position: ((day + 3) % 12), sign: getSignForPosition((day + 3) % 12) },
      { name: 'Ketu', position: ((day + 9) % 12), sign: getSignForPosition((day + 9) % 12) },
    ];
  };

  const getSignForPosition = (position: number) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[position];
  };

  const chartData = generateChartData();
  const planetData = generatePlanetData();

  const config = {
    data1: { color: "#0ea5e9" },
    data2: { color: "#8b5cf6" },
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cosmic-bg/90 backdrop-blur-sm p-2 border border-cosmic-accent/30 rounded text-cosmic-text">
          <p>{`${payload[0].payload.sign}`}</p>
          <p>{`House: ${payload[0].payload.house}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-cosmic-accent border-cosmic-accent/30 hover:bg-cosmic-accent/10">
          View North Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[800px] bg-cosmic-bg border border-cosmic-accent/20">
        <DialogHeader>
          <DialogTitle className="text-cosmic-accent">Vedic Astrology North Chart</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="grid gap-4">
            <div className="text-cosmic-text text-sm">
              <p><span className="text-cosmic-accent">Birth Date:</span> {dateOfBirth}</p>
              {birthTime && <p><span className="text-cosmic-accent">Birth Time:</span> {birthTime}</p>}
              <p><span className="text-cosmic-accent">Location:</span> {location}</p>
              {gender && <p><span className="text-cosmic-accent">Gender:</span> {gender}</p>}
            </div>
            
            <div className="h-[400px] bg-cosmic-bg/50 rounded-lg p-4 border border-cosmic-accent/10">
              <ChartContainer 
                className="h-full" 
                config={config}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, house }) => `${name} (${house})`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-cosmic-bg/30 border border-cosmic-accent/20 rounded">
                <thead>
                  <tr className="border-b border-cosmic-accent/20">
                    <th className="px-4 py-2 text-left text-cosmic-accent">Planet</th>
                    <th className="px-4 py-2 text-left text-cosmic-accent">Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {planetData.map((planet, index) => (
                    <tr key={index} className="border-b border-cosmic-accent/10 last:border-0">
                      <td className="px-4 py-2 text-cosmic-text">{planet.name}</td>
                      <td className="px-4 py-2 text-cosmic-text">{planet.sign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-cosmic-text/80 text-sm mt-2">
              <p className="italic">Note: This is a simplified representation of a North/Vedic chart. 
              For a more accurate astrological reading, please consult with a professional astrologer.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NorthChart;
