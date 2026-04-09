import { type JSX } from "solid-js";

type StartGameButtonProps = {
  inverted?: boolean;
  testId: string;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
};

export function StartGameButton(props: StartGameButtonProps): JSX.Element {
  return (
    <button
      data-testid={props.testId}
      class={`start-game-button${props.inverted ? " start-game-button-inverted" : ""}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.label ?? "Start game"}
    </button>
  );
}
