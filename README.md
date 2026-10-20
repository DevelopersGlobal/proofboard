# ProofBoard

A product launch board ranked on proof, not reach. Makers prove control of the
domain behind their listing; verified products rank in a band above unverified
ones, and votes only move a product within its band, never past it.

## How ranking works

- Boards run Monday to Sunday (UTC), plus an all-time leaderboard.
- **Evidence band first.** A listing whose maker proved domain control outranks
  every unverified listing, regardless of votes.
- **Votes within the band.** One vote per signed-in account per product;
  a second click removes it.
- **Live badge bonus (+10).** While the badge stays live on the product's
  domain, the listing earns a small score bonus.
- **Proofs expire.** A scheduled job re-fetches every proof on a rolling cycle.
  If the proof disappears, the verified mark and the bonus drop at the next
  check, and the listing shows the date the proof was last confirmed.

Every listing publishes its ranking inputs (votes, bonus, band, last-checked
date) so anyone can check the arithmetic.

## Verification

A listing is verified when its own domain serves the listing's unique token,
checked two ways:

1. A file at `https://<domain>/.well-known/proofboard.txt` containing the token, or
2. An HTML badge on the homepage:
   `<a href="<board>/product/<slug>" data-proofboard-token="<token>">Verified on ProofBoard</a>`

No account connections, no analytics access. The owner runs the check from the
product page; a daily job re-checks every verified listing.

## Stack

- Next.js (App Router) + Tailwind CSS
- Supabase (Postgres + email magic-link auth)
- Vercel (hosting + cron for the daily re-check)

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

Create the database with `supabase/schema.sql` in the Supabase SQL editor, and
enable email auth in the Supabase dashboard. Set `NEXT_PUBLIC_SITE_URL` to the
public origin, and `CRON_SECRET` to protect the re-check route.

## What verification does not mean

Verification proves that whoever controls a domain stood behind a listing on
the date it was checked. It says nothing about whether the product is good or
worth your money.

## License

MIT
