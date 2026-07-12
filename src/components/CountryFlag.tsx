const defaultFlags: Record<string, string> = {
  india: "\u{1F1EE}\u{1F1F3}",
  "united kingdom": "\u{1F1EC}\u{1F1E7}",
  uk: "\u{1F1EC}\u{1F1E7}",
  "united states": "\u{1F1FA}\u{1F1F8}",
  usa: "\u{1F1FA}\u{1F1F8}",
  australia: "\u{1F1E6}\u{1F1FA}",
  singapore: "\u{1F1F8}\u{1F1EC}",
  canada: "\u{1F1E8}\u{1F1E6}",
  germany: "\u{1F1E9}\u{1F1EA}",
  france: "\u{1F1EB}\u{1F1F7}",
  japan: "\u{1F1EF}\u{1F1F5}",
  china: "\u{1F1E8}\u{1F1F3}",
  brazil: "\u{1F1E7}\u{1F1F7}",
  uae: "\u{1F1E6}\u{1F1EA}",
  "new zealand": "\u{1F1F3}\u{1F1FF}",
  netherlands: "\u{1F1F3}\u{1F1F1}",
  switzerland: "\u{1F1E8}\u{1F1ED}",
  italy: "\u{1F1EE}\u{1F1F9}",
  spain: "\u{1F1EA}\u{1F1F8}",
  sweden: "\u{1F1F8}\u{1F1EA}",
  "south korea": "\u{1F1F0}\u{1F1F7}",
  "hong kong": "\u{1F1ED}\u{1F1F0}",
};
export function CountryFlag({ country }: { country: string }) {
  const flag = defaultFlags[country.toLowerCase()] ?? "\u{1F310}";
  return <span role="img" aria-label={country} title={country}>{flag}</span>;
}
