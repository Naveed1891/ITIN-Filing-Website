// Country data for the country selector and international phone input.
// `dial` = calling code (no +). `min`/`max` = expected national number length
// (digits after the dial code) used to bound the phone input per country.
export type Country = {
  name: string;
  iso2: string;
  dial: string;
  min: number;
  max: number;
};

export const COUNTRIES: Country[] = [
  { name: "Afghanistan", iso2: "AF", dial: "93", min: 9, max: 9 },
  { name: "Albania", iso2: "AL", dial: "355", min: 8, max: 9 },
  { name: "Algeria", iso2: "DZ", dial: "213", min: 9, max: 9 },
  { name: "Argentina", iso2: "AR", dial: "54", min: 10, max: 11 },
  { name: "Armenia", iso2: "AM", dial: "374", min: 8, max: 8 },
  { name: "Australia", iso2: "AU", dial: "61", min: 9, max: 9 },
  { name: "Austria", iso2: "AT", dial: "43", min: 7, max: 13 },
  { name: "Azerbaijan", iso2: "AZ", dial: "994", min: 9, max: 9 },
  { name: "Bahrain", iso2: "BH", dial: "973", min: 8, max: 8 },
  { name: "Bangladesh", iso2: "BD", dial: "880", min: 10, max: 10 },
  { name: "Belarus", iso2: "BY", dial: "375", min: 9, max: 9 },
  { name: "Belgium", iso2: "BE", dial: "32", min: 8, max: 9 },
  { name: "Bolivia", iso2: "BO", dial: "591", min: 8, max: 8 },
  { name: "Bosnia and Herzegovina", iso2: "BA", dial: "387", min: 8, max: 8 },
  { name: "Brazil", iso2: "BR", dial: "55", min: 10, max: 11 },
  { name: "Bulgaria", iso2: "BG", dial: "359", min: 8, max: 9 },
  { name: "Cambodia", iso2: "KH", dial: "855", min: 8, max: 9 },
  { name: "Cameroon", iso2: "CM", dial: "237", min: 9, max: 9 },
  { name: "Canada", iso2: "CA", dial: "1", min: 10, max: 10 },
  { name: "Chile", iso2: "CL", dial: "56", min: 9, max: 9 },
  { name: "China", iso2: "CN", dial: "86", min: 11, max: 11 },
  { name: "Colombia", iso2: "CO", dial: "57", min: 10, max: 10 },
  { name: "Costa Rica", iso2: "CR", dial: "506", min: 8, max: 8 },
  { name: "Croatia", iso2: "HR", dial: "385", min: 8, max: 9 },
  { name: "Cyprus", iso2: "CY", dial: "357", min: 8, max: 8 },
  { name: "Czechia", iso2: "CZ", dial: "420", min: 9, max: 9 },
  { name: "Denmark", iso2: "DK", dial: "45", min: 8, max: 8 },
  { name: "Dominican Republic", iso2: "DO", dial: "1", min: 10, max: 10 },
  { name: "Ecuador", iso2: "EC", dial: "593", min: 9, max: 9 },
  { name: "Egypt", iso2: "EG", dial: "20", min: 10, max: 10 },
  { name: "El Salvador", iso2: "SV", dial: "503", min: 8, max: 8 },
  { name: "Estonia", iso2: "EE", dial: "372", min: 7, max: 8 },
  { name: "Ethiopia", iso2: "ET", dial: "251", min: 9, max: 9 },
  { name: "Finland", iso2: "FI", dial: "358", min: 9, max: 10 },
  { name: "France", iso2: "FR", dial: "33", min: 9, max: 9 },
  { name: "Georgia", iso2: "GE", dial: "995", min: 9, max: 9 },
  { name: "Germany", iso2: "DE", dial: "49", min: 10, max: 11 },
  { name: "Ghana", iso2: "GH", dial: "233", min: 9, max: 9 },
  { name: "Greece", iso2: "GR", dial: "30", min: 10, max: 10 },
  { name: "Guatemala", iso2: "GT", dial: "502", min: 8, max: 8 },
  { name: "Honduras", iso2: "HN", dial: "504", min: 8, max: 8 },
  { name: "Hong Kong", iso2: "HK", dial: "852", min: 8, max: 8 },
  { name: "Hungary", iso2: "HU", dial: "36", min: 9, max: 9 },
  { name: "Iceland", iso2: "IS", dial: "354", min: 7, max: 9 },
  { name: "India", iso2: "IN", dial: "91", min: 10, max: 10 },
  { name: "Indonesia", iso2: "ID", dial: "62", min: 9, max: 12 },
  { name: "Iraq", iso2: "IQ", dial: "964", min: 10, max: 10 },
  { name: "Ireland", iso2: "IE", dial: "353", min: 9, max: 9 },
  { name: "Israel", iso2: "IL", dial: "972", min: 9, max: 9 },
  { name: "Italy", iso2: "IT", dial: "39", min: 9, max: 11 },
  { name: "Jamaica", iso2: "JM", dial: "1", min: 10, max: 10 },
  { name: "Japan", iso2: "JP", dial: "81", min: 10, max: 10 },
  { name: "Jordan", iso2: "JO", dial: "962", min: 9, max: 9 },
  { name: "Kazakhstan", iso2: "KZ", dial: "7", min: 10, max: 10 },
  { name: "Kenya", iso2: "KE", dial: "254", min: 9, max: 9 },
  { name: "Kuwait", iso2: "KW", dial: "965", min: 8, max: 8 },
  { name: "Kyrgyzstan", iso2: "KG", dial: "996", min: 9, max: 9 },
  { name: "Latvia", iso2: "LV", dial: "371", min: 8, max: 8 },
  { name: "Lebanon", iso2: "LB", dial: "961", min: 7, max: 8 },
  { name: "Libya", iso2: "LY", dial: "218", min: 9, max: 9 },
  { name: "Lithuania", iso2: "LT", dial: "370", min: 8, max: 8 },
  { name: "Luxembourg", iso2: "LU", dial: "352", min: 8, max: 9 },
  { name: "Malaysia", iso2: "MY", dial: "60", min: 9, max: 10 },
  { name: "Maldives", iso2: "MV", dial: "960", min: 7, max: 7 },
  { name: "Malta", iso2: "MT", dial: "356", min: 8, max: 8 },
  { name: "Mauritius", iso2: "MU", dial: "230", min: 8, max: 8 },
  { name: "Mexico", iso2: "MX", dial: "52", min: 10, max: 10 },
  { name: "Moldova", iso2: "MD", dial: "373", min: 8, max: 8 },
  { name: "Morocco", iso2: "MA", dial: "212", min: 9, max: 9 },
  { name: "Nepal", iso2: "NP", dial: "977", min: 10, max: 10 },
  { name: "Netherlands", iso2: "NL", dial: "31", min: 9, max: 9 },
  { name: "New Zealand", iso2: "NZ", dial: "64", min: 8, max: 10 },
  { name: "Nigeria", iso2: "NG", dial: "234", min: 10, max: 10 },
  { name: "North Macedonia", iso2: "MK", dial: "389", min: 8, max: 8 },
  { name: "Norway", iso2: "NO", dial: "47", min: 8, max: 8 },
  { name: "Oman", iso2: "OM", dial: "968", min: 8, max: 8 },
  { name: "Pakistan", iso2: "PK", dial: "92", min: 10, max: 10 },
  { name: "Panama", iso2: "PA", dial: "507", min: 8, max: 8 },
  { name: "Paraguay", iso2: "PY", dial: "595", min: 9, max: 9 },
  { name: "Peru", iso2: "PE", dial: "51", min: 9, max: 9 },
  { name: "Philippines", iso2: "PH", dial: "63", min: 10, max: 10 },
  { name: "Poland", iso2: "PL", dial: "48", min: 9, max: 9 },
  { name: "Portugal", iso2: "PT", dial: "351", min: 9, max: 9 },
  { name: "Qatar", iso2: "QA", dial: "974", min: 8, max: 8 },
  { name: "Romania", iso2: "RO", dial: "40", min: 9, max: 9 },
  { name: "Russia", iso2: "RU", dial: "7", min: 10, max: 10 },
  { name: "Saudi Arabia", iso2: "SA", dial: "966", min: 9, max: 9 },
  { name: "Senegal", iso2: "SN", dial: "221", min: 9, max: 9 },
  { name: "Serbia", iso2: "RS", dial: "381", min: 8, max: 9 },
  { name: "Singapore", iso2: "SG", dial: "65", min: 8, max: 8 },
  { name: "Slovakia", iso2: "SK", dial: "421", min: 9, max: 9 },
  { name: "Slovenia", iso2: "SI", dial: "386", min: 8, max: 8 },
  { name: "South Africa", iso2: "ZA", dial: "27", min: 9, max: 9 },
  { name: "South Korea", iso2: "KR", dial: "82", min: 9, max: 10 },
  { name: "Spain", iso2: "ES", dial: "34", min: 9, max: 9 },
  { name: "Sri Lanka", iso2: "LK", dial: "94", min: 9, max: 9 },
  { name: "Sweden", iso2: "SE", dial: "46", min: 7, max: 9 },
  { name: "Switzerland", iso2: "CH", dial: "41", min: 9, max: 9 },
  { name: "Taiwan", iso2: "TW", dial: "886", min: 9, max: 9 },
  { name: "Tanzania", iso2: "TZ", dial: "255", min: 9, max: 9 },
  { name: "Thailand", iso2: "TH", dial: "66", min: 9, max: 9 },
  { name: "Tunisia", iso2: "TN", dial: "216", min: 8, max: 8 },
  { name: "Turkey", iso2: "TR", dial: "90", min: 10, max: 10 },
  { name: "Uganda", iso2: "UG", dial: "256", min: 9, max: 9 },
  { name: "Ukraine", iso2: "UA", dial: "380", min: 9, max: 9 },
  { name: "United Arab Emirates", iso2: "AE", dial: "971", min: 9, max: 9 },
  { name: "United Kingdom", iso2: "GB", dial: "44", min: 10, max: 10 },
  { name: "United States", iso2: "US", dial: "1", min: 10, max: 10 },
  { name: "Uruguay", iso2: "UY", dial: "598", min: 8, max: 8 },
  { name: "Uzbekistan", iso2: "UZ", dial: "998", min: 9, max: 9 },
  { name: "Venezuela", iso2: "VE", dial: "58", min: 10, max: 10 },
  { name: "Vietnam", iso2: "VN", dial: "84", min: 9, max: 10 },
  { name: "Yemen", iso2: "YE", dial: "967", min: 9, max: 9 },
  { name: "Zambia", iso2: "ZM", dial: "260", min: 9, max: 9 },
  { name: "Zimbabwe", iso2: "ZW", dial: "263", min: 9, max: 9 },
];

/** Flag emoji from an ISO-3166 alpha-2 code (regional indicator letters). */
export function flagEmoji(iso2: string): string {
  if (!/^[A-Za-z]{2}$/.test(iso2)) return "🏳️";
  const base = 0x1f1e6;
  const cp = iso2
    .toUpperCase()
    .split("")
    .map((c) => base + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...cp);
}

export function countryByName(name: string | null | undefined): Country | undefined {
  if (!name) return undefined;
  const n = name.trim().toLowerCase();
  return COUNTRIES.find((c) => c.name.toLowerCase() === n);
}
