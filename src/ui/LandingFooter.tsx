import type { JSX } from "solid-js";

import { GitHubSourceLink } from "./GitHubSourceLink.js";

export function LandingFooter(): JSX.Element {
  return (
    <div class="landing-footer">
      <GitHubSourceLink />
    </div>
  );
}
