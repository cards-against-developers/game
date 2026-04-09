import { type JSX } from "solid-js";

import type { AppController } from "../app/controller.js";
import { AppFrame } from "./AppFrame.js";
import { LandingPage } from "./LandingPage.js";
import { Masthead } from "./Masthead.js";

type AppProps = {
  controller: AppController;
};

export function App(props: AppProps): JSX.Element {
  const state = () => props.controller.state;
  const showLanding = () => !state().host && !state().guest.channel;

  return (
    <main class={`shell${showLanding() ? "" : " shell-game"}`}>
      {showLanding() ? (
        <>
          <Masthead />
          <LandingPage
            usernameInput={state().usernameInput}
            hasJoinHost={state().joinHostId.trim().length > 0}
            status={state().guest.status || state().flash}
            onUsernameInput={props.controller.updateUsername}
            onCreateHost={() => void props.controller.createHost()}
            onJoinHost={() => void props.controller.prepareGuestAnswer()}
          />
        </>
      ) : (
        <AppFrame controller={props.controller} />
      )}
    </main>
  );
}
