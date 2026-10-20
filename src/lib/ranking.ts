export type Rankable = {
  id: string;
  verified_at: string | null;
  badge_live: boolean;
  created_at: string;
  vote_count: number;
};

// Evidence band first (verified outranks unverified), then score inside the band.
// Score = votes + a small bonus while the badge is live. Votes can never move a
// product past the band boundary.
export const BADGE_BONUS = 10;

export function scoreOf(p: Rankable): number {
  return p.vote_count + (p.badge_live ? BADGE_BONUS : 0);
}

export function bandOf(p: Rankable): number {
  return p.verified_at ? 1 : 0;
}

export function rankProducts<T extends Rankable>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const band = bandOf(b) - bandOf(a);
    if (band !== 0) return band;
    const score = scoreOf(b) - scoreOf(a);
    if (score !== 0) return score;
    return a.created_at.localeCompare(b.created_at);
  });
}
