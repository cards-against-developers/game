import type { JSX } from "solid-js";

import { LandingPage } from "./LandingPage.js";
import { Masthead } from "./Masthead.js";

type LandingStatusLabAppProps = {
  status: string;
};

export function LandingStatusLabApp(
  props: LandingStatusLabAppProps
): JSX.Element {
  return (
    <main class="shell">
      <Masthead />
      <LandingPage
        usernameInput="Guest"
        hasJoinHost
        status={props.status}
        onUsernameInput={() => undefined}
        onCreateHost={() => undefined}
        onJoinHost={() => undefined}
      />
    </main>
  );
}
