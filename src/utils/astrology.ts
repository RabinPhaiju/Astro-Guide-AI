
// Array of astrological responses for different question categories
const astrologyResponses = {
  // Love and relationship responses
  love: [
    "The stars indicate a period of deep connection approaching. Open your heart to new possibilities.",
    "Venus is guiding your romantic energies now. Trust your intuition about this connection.",
    "The cosmic alignment suggests patience in matters of the heart. What's meant for you will not pass you by.",
    "Your romantic aura is particularly strong under this moon phase. Express your true feelings.",
    "The celestial bodies suggest a meaningful encounter is on the horizon. Stay receptive.",
  ],
  
  // Career and success responses
  career: [
    "Mercury's position suggests new professional opportunities. Be prepared to showcase your unique talents.",
    "The celestial alignment indicates a favorable time for career advancement. Trust your capabilities.",
    "Jupiter's influence brings expansion in your professional sphere. Consider bold new directions.",
    "The stars suggest a period of professional growth through collaboration. Connect with like-minded individuals.",
    "Saturn's energy provides structure to your ambitions. Patience and persistence will lead to success.",
  ],
  
  // Personal growth responses
  personal: [
    "The cosmos suggests a period of introspection will lead to profound self-discovery.",
    "Your ruling planet is entering a phase of transformation. Embrace the changes within.",
    "The universe is supporting your journey of self-improvement. Trust the process.",
    "Celestial energies are aligned for your personal evolution. Release what no longer serves you.",
    "The current planetary positions favor spiritual growth. Listen to your inner wisdom.",
  ],
  
  // General guidance responses
  general: [
    "The cosmic energy surrounding you is supportive of your current path. Trust the journey.",
    "Stars are aligning to bring clarity to your situation. Patience will reveal the answers you seek.",
    "Celestial forces suggest taking time for reflection before making your next move.",
    "The universal energies indicate favorable outcomes when you follow your intuition.",
    "The cosmic vibrations surrounding your question suggest embracing flexibility and openness.",
  ],
};

// Mystical phrases to begin responses
const mysticalIntros = [
  "The celestial bodies reveal that",
  "As the stars align, I see that",
  "The cosmic energies suggest",
  "Your astrological chart indicates",
  "The planetary positions show",
  "The mystical forces convey that",
  "The universe whispers that",
  "Your cosmic pathway reveals",
  "The astral plane indicates",
  "The moon's influence suggests",
];

// Closing statements with astrological references
const mysticalClosings = [
  "Trust in the universe's plan for you.",
  "The stars guide your journey forward.",
  "Your celestial path is unfolding as it should.",
  "The cosmos supports your authentic self.",
  "Planetary energies favor your intentions.",
  "Align with these cosmic vibrations.",
  "Your astrological signs point toward success.",
  "The heavens bless your endeavors.",
  "Celestial wisdom lights your way.",
  "The universal energy flows in your favor.",
];

/**
 * Categorizes a question to determine the appropriate response type
 */
function categorizeQuestion(question: string): keyof typeof astrologyResponses {
  question = question.toLowerCase();
  
  if (question.match(/love|relationship|partner|marriage|date|romantic|boyfriend|girlfriend|spouse/i)) {
    return "love";
  } else if (question.match(/career|job|work|profession|business|success|money|finance|promotion/i)) {
    return "career";
  } else if (question.match(/myself|growth|improve|learn|personal|develop|spiritual|better|heal|health/i)) {
    return "personal";
  } else {
    return "general";
  }
}

/**
 * Generates a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates an astrological response based on the user's question
 */
export function generateAstrologyResponse(question: string): string {
  const category = categorizeQuestion(question);
  const intro = getRandomElement(mysticalIntros);
  const mainResponse = getRandomElement(astrologyResponses[category]);
  const closing = getRandomElement(mysticalClosings);
  
  return `${intro} ${mainResponse} ${closing}`;
}
