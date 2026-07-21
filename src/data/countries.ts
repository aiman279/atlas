/** Curated country list for Atlas — isoNumeric matches world-atlas ids. */
export interface CountryOption {
  name: string;
  flag: string;
  isoNumeric: string;
  continent: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { name: 'Malaysia', flag: '🇲🇾', isoNumeric: '458', continent: 'Asia' },
  { name: 'Thailand', flag: '🇹🇭', isoNumeric: '764', continent: 'Asia' },
  { name: 'Japan', flag: '🇯🇵', isoNumeric: '392', continent: 'Asia' },
  { name: 'Indonesia', flag: '🇮🇩', isoNumeric: '360', continent: 'Asia' },
  { name: 'Singapore', flag: '🇸🇬', isoNumeric: '702', continent: 'Asia' },
  { name: 'Vietnam', flag: '🇻🇳', isoNumeric: '704', continent: 'Asia' },
  { name: 'South Korea', flag: '🇰🇷', isoNumeric: '410', continent: 'Asia' },
  { name: 'China', flag: '🇨🇳', isoNumeric: '156', continent: 'Asia' },
  { name: 'India', flag: '🇮🇳', isoNumeric: '356', continent: 'Asia' },
  { name: 'Philippines', flag: '🇵🇭', isoNumeric: '608', continent: 'Asia' },
  { name: 'Taiwan', flag: '🇹🇼', isoNumeric: '158', continent: 'Asia' },
  { name: 'Hong Kong', flag: '🇭🇰', isoNumeric: '344', continent: 'Asia' },
  { name: 'Cambodia', flag: '🇰🇭', isoNumeric: '116', continent: 'Asia' },
  { name: 'Laos', flag: '🇱🇦', isoNumeric: '418', continent: 'Asia' },
  { name: 'Myanmar', flag: '🇲🇲', isoNumeric: '104', continent: 'Asia' },
  { name: 'Nepal', flag: '🇳🇵', isoNumeric: '524', continent: 'Asia' },
  { name: 'Sri Lanka', flag: '🇱🇰', isoNumeric: '144', continent: 'Asia' },
  { name: 'United Arab Emirates', flag: '🇦🇪', isoNumeric: '784', continent: 'Asia' },
  { name: 'Saudi Arabia', flag: '🇸🇦', isoNumeric: '682', continent: 'Asia' },
  { name: 'Turkey', flag: '🇹🇷', isoNumeric: '792', continent: 'Asia' },
  { name: 'Australia', flag: '🇦🇺', isoNumeric: '036', continent: 'Oceania' },
  { name: 'New Zealand', flag: '🇳🇿', isoNumeric: '554', continent: 'Oceania' },
  { name: 'United Kingdom', flag: '🇬🇧', isoNumeric: '826', continent: 'Europe' },
  { name: 'France', flag: '🇫🇷', isoNumeric: '250', continent: 'Europe' },
  { name: 'Italy', flag: '🇮🇹', isoNumeric: '380', continent: 'Europe' },
  { name: 'Spain', flag: '🇪🇸', isoNumeric: '724', continent: 'Europe' },
  { name: 'Germany', flag: '🇩🇪', isoNumeric: '276', continent: 'Europe' },
  { name: 'Netherlands', flag: '🇳🇱', isoNumeric: '528', continent: 'Europe' },
  { name: 'Switzerland', flag: '🇨🇭', isoNumeric: '756', continent: 'Europe' },
  { name: 'Portugal', flag: '🇵🇹', isoNumeric: '620', continent: 'Europe' },
  { name: 'Greece', flag: '🇬🇷', isoNumeric: '300', continent: 'Europe' },
  { name: 'Iceland', flag: '🇮🇸', isoNumeric: '352', continent: 'Europe' },
  { name: 'United States of America', flag: '🇺🇸', isoNumeric: '840', continent: 'Americas' },
  { name: 'Canada', flag: '🇨🇦', isoNumeric: '124', continent: 'Americas' },
  { name: 'Mexico', flag: '🇲🇽', isoNumeric: '484', continent: 'Americas' },
  { name: 'Brazil', flag: '🇧🇷', isoNumeric: '076', continent: 'Americas' },
  { name: 'Argentina', flag: '🇦🇷', isoNumeric: '032', continent: 'Americas' },
  { name: 'Egypt', flag: '🇪🇬', isoNumeric: '818', continent: 'Africa' },
  { name: 'South Africa', flag: '🇿🇦', isoNumeric: '710', continent: 'Africa' },
  { name: 'Morocco', flag: '🇲🇦', isoNumeric: '504', continent: 'Africa' },
  { name: 'Kenya', flag: '🇰🇪', isoNumeric: '404', continent: 'Africa' },
];
