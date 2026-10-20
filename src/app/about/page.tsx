export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <article className="prose prose-neutral max-w-2xl">
      <h1>About ProofBoard</h1>
      <p>
        Launch boards rank by whoever brought the biggest crowd. ProofBoard ranks on one checked
        fact instead: whether the maker proved control of the domain behind the listing.
      </p>
      <h2>How ranking works</h2>
      <ul>
        <li>The board opens every Monday and closes the following Sunday (UTC).</li>
        <li>Verified products rank in a band above unverified ones.</li>
        <li>Votes order products within their band. Votes never move a product past the band boundary.</li>
        <li>A live badge on the product&apos;s domain adds a small bonus to the score.</li>
      </ul>
      <h2>What verification means</h2>
      <p>
        The maker places a token - a small file or an HTML badge - on the product&apos;s own domain,
        and ProofBoard fetches it directly. No account connections, no analytics access, nothing to
        revoke. The proof is re-checked on a rolling cycle; if it disappears, the verified mark and
        the bonus drop at the next check, and the listing shows the date the proof was last confirmed.
      </p>
      <h2>The honest limits</h2>
      <p>
        Verification proves that whoever controls the domain stood behind the listing on the day it
        was checked. It says nothing about whether the product is good, well run, or worth your money.
        Treat the mark as a floor on what has been demonstrated, never as a recommendation.
      </p>
      <h2>Open source</h2>
      <p>
        ProofBoard is open source under the MIT license. Ranking inputs are published on every
        listing, so you can check the arithmetic yourself.
      </p>
    </article>
  );
}
