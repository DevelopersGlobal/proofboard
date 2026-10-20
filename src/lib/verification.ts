// Domain-control proof. A listing is verified when the product's own domain
// serves the listing's token, either as a file at /.well-known/proofboard.txt
// or as an HTML snippet (the "badge") anywhere on the homepage.
// The badge doubles as the visible mark; only the badge earns the live-badge bonus.

export type CheckResult = {
  ok: boolean;
  badge: boolean;
  detail: string;
  checkedAt: string;
};

const FETCH_OPTS: RequestInit = {
  redirect: "follow",
  headers: { "user-agent": "ProofBoard-Checker/1.0 (+https://proofboard.app)" },
  signal: AbortSignal.timeout(10000),
};

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { ...FETCH_OPTS, cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function badgeSnippet(siteUrl: string, token: string): string {
  return `<a href="${siteUrl}" data-proofboard-token="${token}" rel="dofollow">Verified on ProofBoard</a>`;
}

export async function checkDomain(domain: string, token: string): Promise<CheckResult> {
  const checkedAt = new Date().toISOString();
  const base = `https://${domain}`;

  const fileBody = await fetchText(`${base}/.well-known/proofboard.txt`);
  if (fileBody !== null && fileBody.includes(token)) {
    return { ok: true, badge: false, detail: "token file served from domain", checkedAt };
  }

  const html = await fetchText(base);
  if (html !== null) {
    if (html.includes(`data-proofboard-token="${token}"`) || html.includes(`data-proofboard-token='${token}'`)) {
      return { ok: true, badge: true, detail: "badge live on homepage", checkedAt };
    }
    if (html.includes(token)) {
      return { ok: true, badge: false, detail: "token present in homepage HTML", checkedAt };
    }
  }

  return { ok: false, badge: false, detail: "token not found on domain", checkedAt };
}
