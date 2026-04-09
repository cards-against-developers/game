import type { JSX } from "solid-js";

export function GitHubSourceLink(): JSX.Element {
  return (
    <a
      class="landing-repo-link"
      href="https://github.com/cards-against-developers/game"
      target="_blank"
      rel="noreferrer"
    >
      Meet the code on GitHub
    </a>
  );
}
