import type { JSX } from "solid-js";

import { LandingFooter } from "./LandingFooter.js";
import { Masthead } from "./Masthead.js";

type NotFoundPageProps = {
  landingHref: string;
};

export function NotFoundPage(props: NotFoundPageProps): JSX.Element {
  return (
    <main class="shell">
      <Masthead />
      <section class="landing">
        <section class="landing-hero landing-hero-start not-found">
          <article class="card black not-found-card">
            <div class="card-label">404</div>
            <h2 class="card-copy card-copy-primary">Page not found</h2>
            <p class="not-found-copy">
              That route does not exist. Head back to the landing page and start
              a new game from there.
            </p>
            <div class="card-footer card-footer-action">
              <a
                data-testid="not-found-home-link"
                class="not-found-home-link"
                href={props.landingHref}
              >
                Back to start page
              </a>
            </div>
          </article>
        </section>
        <LandingFooter />
      </section>
    </main>
  );
}
