import { createEffect, on, onCleanup, onMount, type JSX } from "solid-js";

type FitTextProps = {
  class?: string;
  text?: string;
  html?: string;
  maxRem?: number;
  minRem?: number;
  stepRem?: number;
  testId?: string;
};

export function FitText(props: FitTextProps): JSX.Element {
  let element: HTMLDivElement | undefined;
  let frame = 0;
  let resizeObserver: ResizeObserver | undefined;

  const scheduleFit = (): void => {
    if (!element) {
      return;
    }

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      fitText();
    });
  };

  const fitText = (): void => {
    if (!element) {
      return;
    }

    const maxRem = props.maxRem ?? 1.35;
    const minRem = props.minRem ?? 0.68;
    const stepRem = props.stepRem ?? 0.04;

    let size = maxRem;
    element.style.setProperty("--fit-font-size", `${size}rem`);

    while (size > minRem) {
      const overflowed =
        element.scrollHeight > element.clientHeight + 1 ||
        element.scrollWidth > element.clientWidth + 1;

      if (!overflowed) {
        break;
      }

      size = Math.max(minRem, size - stepRem);
      element.style.setProperty("--fit-font-size", `${size}rem`);
    }
  };

  onMount(() => {
    if (!element) {
      return;
    }

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        scheduleFit();
      });
      resizeObserver.observe(element);
    } else {
      window.addEventListener("resize", scheduleFit);
    }

    scheduleFit();
  });

  createEffect(() => {
    scheduleFit();
  });

  createEffect(
    on(
      () => [props.text, props.html, props.maxRem, props.minRem, props.stepRem],
      () => {
        scheduleFit();
      }
    )
  );

  onCleanup(() => {
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    window.removeEventListener("resize", scheduleFit);
  });

  return (
    <div
      ref={(node) => {
        element = node;
      }}
      data-testid={props.testId}
      class={`card-copy fit-text ${props.class ?? ""}`.trim()}
      style={{ "--fit-font-size": `${props.maxRem ?? 1.35}rem` }}
      innerHTML={props.html}
    >
      {props.html ? undefined : props.text}
    </div>
  );
}
