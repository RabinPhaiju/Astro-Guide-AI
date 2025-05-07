
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NorthChartProps {
  dateOfBirth: string;
  location: string;
  birthTime?: string;
  gender?: string;
}

interface PlanetPosition {
  name: string;
  house: number;
  sign: string;
  shortName: string;
}

const NorthChart: React.FC<NorthChartProps> = ({ dateOfBirth, location, birthTime, gender }) => {
  // Generate semi-realistic house positions based on DOB
  const generatePlanetPositions = (): PlanetPosition[] => {
    const dob = new Date(dateOfBirth);
    const day = dob.getDate();
    const month = dob.getMonth() + 1;
    
    return [
      { name: 'Sun', house: (day % 12) + 1, sign: getSignForHouse((day % 12) + 1), shortName: 'Su' },
      { name: 'Moon', house: ((day + 2) % 12) + 1, sign: getSignForHouse(((day + 2) % 12) + 1), shortName: 'Mo' },
      { name: 'Mercury', house: ((day + 4) % 12) + 1, sign: getSignForHouse(((day + 4) % 12) + 1), shortName: 'Me' },
      { name: 'Venus', house: ((day + 6) % 12) + 1, sign: getSignForHouse(((day + 6) % 12) + 1), shortName: 'Ve' },
      { name: 'Mars', house: ((day + 8) % 12) + 1, sign: getSignForHouse(((day + 8) % 12) + 1), shortName: 'Ma' },
      { name: 'Jupiter', house: ((day + 10) % 12) + 1, sign: getSignForHouse(((day + 10) % 12) + 1), shortName: 'Ju' },
      { name: 'Saturn', house: ((day + 1) % 12) + 1, sign: getSignForHouse(((day + 1) % 12) + 1), shortName: 'Sa' },
      { name: 'Rahu', house: ((day + 3) % 12) + 1, sign: getSignForHouse(((day + 3) % 12) + 1), shortName: 'Ra' },
      { name: 'Ketu', house: ((day + 9) % 12) + 1, sign: getSignForHouse(((day + 9) % 12) + 1), shortName: 'Ke' },
    ];
  };

  const getSignForHouse = (house: number): string => {
    // This is a simplified version - in real astrology, this would be calculated based on ascendant
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[(house - 1) % 12];
  };

  // Generate planet positions
  const planetPositions = generatePlanetPositions();

  // Group planets by house
  const planetsByHouse: Record<number, PlanetPosition[]> = {};
  planetPositions.forEach(planet => {
    if (!planetsByHouse[planet.house]) {
      planetsByHouse[planet.house] = [];
    }
    planetsByHouse[planet.house].push(planet);
  });

  // Helper to get planets text for a specific house
  const getPlanetsForHouse = (house: number): string => {
    const planets = planetsByHouse[house];
    if (!planets || planets.length === 0) return '';
    
    return planets.map(p => p.shortName).join(', ');
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
            
            <div className="relative aspect-square max-h-[500px] mx-auto">
              {/* Traditional North Indian Square Chart */}
              <div className="w-full h-full border-2 border-cosmic-accent rounded-md relative">
                {/* Diagonal lines */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-full h-full border-cosmic-accent">
                    <div className="absolute top-0 left-0 w-full h-full">
                      {/* Diagonal line from top-left to bottom-right */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        <svg className="absolute top-0 left-0 w-full h-full">
                          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#B91C1C" strokeWidth="2" />
                        </svg>
                      </div>
                      
                      {/* Diagonal line from top-right to bottom-left */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        <svg className="absolute top-0 left-0 w-full h-full">
                          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#B91C1C" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Horizontal and vertical dividing lines */}
                <div className="absolute top-0 left-0 w-full h-1/2 border-b-2 border-cosmic-accent"></div>
                <div className="absolute top-0 left-0 w-1/2 h-full border-r-2 border-cosmic-accent"></div>

                {/* Curved lines for the 12 houses */}
                <svg className="absolute top-0 left-0 w-full h-full">
                  {/* Top left quadrant curved lines */}
                  <path d="M 0,25% Q 25%,25% 25%,0" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 50%,25% Q 25%,25% 25%,0" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 0,50% Q 0,25% 25%,25%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 25%,50% Q 25%,25% 50%,25%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  
                  {/* Top right quadrant curved lines */}
                  <path d="M 50%,0 Q 75%,0 75%,25%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 75%,50% Q 75%,25% 100%,25%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 50%,25% Q 75%,25% 75%,50%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 100%,0 Q 75%,0 75%,25%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  
                  {/* Bottom left quadrant curved lines */}
                  <path d="M 0,50% Q 0,75% 25%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 0,100% Q 0,75% 25%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 25%,50% Q 25%,75% 50%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 25%,100% Q 25%,75% 50%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  
                  {/* Bottom right quadrant curved lines */}
                  <path d="M 50%,75% Q 75%,75% 75%,50%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 50%,75% Q 75%,75% 75%,100%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 75%,50% Q 75%,75% 100%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                  <path d="M 75%,100% Q 75%,75% 100%,75%" fill="none" stroke="#B91C1C" strokeWidth="2" />
                </svg>

                {/* House 1 (Bottom left) */}
                <div className="absolute bottom-[10%] left-[12.5%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">1</div>
                  <div className="text-xs">{getPlanetsForHouse(1)}</div>
                </div>

                {/* House 2 (Bottom left) */}
                <div className="absolute bottom-[12.5%] left-[10%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">2</div>
                  <div className="text-xs">{getPlanetsForHouse(2)}</div>
                </div>

                {/* House 3 (Bottom center) */}
                <div className="absolute bottom-[25%] left-[37.5%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">3</div>
                  <div className="text-xs">{getPlanetsForHouse(3)}</div>
                </div>

                {/* House 4 (Bottom right) */}
                <div className="absolute bottom-[12.5%] left-[62.5%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">4</div>
                  <div className="text-xs">{getPlanetsForHouse(4)}</div>
                </div>

                {/* House 5 (Bottom right) */}
                <div className="absolute bottom-[10%] right-[12.5%] transform translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">5</div>
                  <div className="text-xs">{getPlanetsForHouse(5)}</div>
                </div>

                {/* House 6 (Middle right) */}
                <div className="absolute top-1/2 right-[25%] transform translate-x-1/2 -translate-y-1/2 text-cosmic-accent">
                  <div className="font-bold">6</div>
                  <div className="text-xs">{getPlanetsForHouse(6)}</div>
                </div>

                {/* House 7 (Top right) */}
                <div className="absolute top-[10%] right-[12.5%] transform translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">7</div>
                  <div className="text-xs">{getPlanetsForHouse(7)}</div>
                </div>

                {/* House 8 (Top right) */}
                <div className="absolute top-[12.5%] right-[10%] transform translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">8</div>
                  <div className="text-xs">{getPlanetsForHouse(8)}</div>
                </div>

                {/* House 9 (Top center) */}
                <div className="absolute top-[25%] right-[37.5%] transform translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">9</div>
                  <div className="text-xs">{getPlanetsForHouse(9)}</div>
                </div>

                {/* House 10 (Top left) */}
                <div className="absolute top-[12.5%] left-[37.5%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">10</div>
                  <div className="text-xs">{getPlanetsForHouse(10)}</div>
                </div>

                {/* House 11 (Top left) */}
                <div className="absolute top-[10%] left-[12.5%] transform -translate-x-1/2 text-cosmic-accent">
                  <div className="font-bold">11</div>
                  <div className="text-xs">{getPlanetsForHouse(11)}</div>
                </div>

                {/* House 12 (Middle left) */}
                <div className="absolute top-1/2 left-[25%] transform -translate-x-1/2 -translate-y-1/2 text-cosmic-accent">
                  <div className="font-bold">12</div>
                  <div className="text-xs">{getPlanetsForHouse(12)}</div>
                </div>

                {/* Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cosmic-accent text-sm">
                  <div className="font-bold">{getSignForHouse(1)}</div>
                  <div className="text-xs">Ascendant</div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-cosmic-bg/30 border border-cosmic-accent/20 rounded">
                <thead>
                  <tr className="border-b border-cosmic-accent/20">
                    <th className="px-4 py-2 text-left text-cosmic-accent">Planet</th>
                    <th className="px-4 py-2 text-left text-cosmic-accent">House</th>
                    <th className="px-4 py-2 text-left text-cosmic-accent">Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {planetPositions.map((planet, index) => (
                    <tr key={index} className="border-b border-cosmic-accent/10 last:border-0">
                      <td className="px-4 py-2 text-cosmic-text">{planet.name}</td>
                      <td className="px-4 py-2 text-cosmic-text">{planet.house}</td>
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
