import { type JSX } from "solid-js";

import {
  CONNECTING_TO_HOST_MESSAGE,
  REJOINING_TABLE_MESSAGE
} from "../network/messages.js";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "../utils/index.js";
import { LandingFooter } from "./LandingFooter.js";
import { StartGameButton } from "./StartGameButton.js";

type LandingPageProps = {
  usernameInput: string;
  hasJoinHost: boolean;
  status?: string;
  onUsernameInput: (value: string) => void;
  onCreateHost: () => void;
  onJoinHost: () => void;
};

export function LandingPage(props: LandingPageProps): JSX.Element {
  const showConnectingSpinner = () => {
    const status = props.status?.trim() ?? "";
    return (
      status.startsWith(CONNECTING_TO_HOST_MESSAGE.replace("…", "")) ||
      status.startsWith(REJOINING_TABLE_MESSAGE.replace("…", "")) ||
      status.includes("Reconnecting in")
    );
  };

  return (
    <section class="landing">
      <section class="landing-hero landing-hero-start">
        <article class="landing-start-card">
          <div class="landing-start-body">
            <label class="tiny" for="landing-username">
              Username
            </label>
            <input
              id="landing-username"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              data-bwignore="true"
              data-1p-ignore="true"
              data-lpignore="true"
              minLength={MIN_USERNAME_LENGTH}
              required
              spellcheck={false}
              maxLength={MAX_USERNAME_LENGTH}
              value={props.usernameInput}
              onInput={(event) =>
                props.onUsernameInput(event.currentTarget.value)
              }
            />
            {props.status?.trim() ? (
              <div class="landing-status">
                {showConnectingSpinner() ? (
                  <span class="landing-status-spinner" aria-hidden="true" />
                ) : null}
                <span>{props.status}</span>
              </div>
            ) : null}
          </div>
          <div class="card-footer landing-start-footer">
            {props.hasJoinHost ? (
              <button data-testid="join-host" onClick={props.onJoinHost}>
                Join game
              </button>
            ) : (
              <StartGameButton
                label="New game"
                testId="create-host"
                onClick={props.onCreateHost}
              />
            )}
          </div>
        </article>
      </section>
      <LandingFooter />
    </section>
  );
}
