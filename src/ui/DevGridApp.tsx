import {
  For,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type JSX
} from "solid-js";

import { createAppController, type AppController } from "../app/controller.js";
import { MemoryTransportHub } from "../network/memory.js";
import { AppFrame } from "./AppFrame.js";

type DevSeat = {
  id: string;
  username: string;
  controller: AppController;
};

type SingleplayerDebugSeat = {
  id: string;
  username: string;
  controller: AppController;
};

const DESIGN_WIDTH = 1440;
const DESIGN_HEIGHT = 1180;

function createDevSeats(sessionId: string): DevSeat[] {
  const memoryTransportHub = new MemoryTransportHub();
  const hostCountdownMs = 5_000;

  return [
    {
      id: "host",
      username: "Host",
      controller: createAppController({
        transportMode: "memory",
        profileName: `${sessionId}.host`,
        memoryTransportHub,
        hostCountdownMs
      })
    },
    {
      id: "alice",
      username: "Alice",
      controller: createAppController({
        transportMode: "memory",
        profileName: `${sessionId}.alice`,
        memoryTransportHub,
        hostCountdownMs
      })
    },
    {
      id: "bob",
      username: "Bob",
      controller: createAppController({
        transportMode: "memory",
        profileName: `${sessionId}.bob`,
        memoryTransportHub,
        hostCountdownMs
      })
    },
    {
      id: "carol",
      username: "Carol",
      controller: createAppController({
        transportMode: "memory",
        profileName: `${sessionId}.carol`,
        memoryTransportHub,
        hostCountdownMs
      })
    }
  ];
}

async function autoConnectGuest(
  host: AppController,
  guest: AppController
): Promise<void> {
  const hostState = host.state.host;
  if (!hostState) {
    throw new Error(readControllerFailure(host, "Failed to boot host seat."));
  }

  guest.updateJoinHost(hostState.peerId, hostState.roomId);
  await guest.prepareGuestAnswer();
  if (!guest.state.guest.channel) {
    throw new Error(readControllerFailure(guest, "Failed to boot guest seat."));
  }
}

function readControllerFailure(
  controller: AppController,
  fallbackMessage: string
): string {
  return (
    controller.state.guest.status || controller.state.flash || fallbackMessage
  );
}

async function createSingleplayerHost(host: AppController): Promise<void> {
  await host.createHost();
  if (!host.state.host) {
    throw new Error(readControllerFailure(host, "Failed to boot host seat."));
  }
}

export function DevGridApp(): JSX.Element {
  const sessionId = `dev-grid.${crypto.randomUUID().slice(0, 8)}`;
  const seats = createDevSeats(sessionId);
  const [bootError, setBootError] = createSignal("");
  const singleplayerWindow = globalThis as typeof globalThis & {
    __singleplayerSeats?: SingleplayerDebugSeat[];
  };

  onMount(() => {
    singleplayerWindow.__singleplayerSeats = seats;
    void (async () => {
      try {
        const [host, ...guests] = seats;
        if (!host) {
          throw new Error("Missing dev-grid host seat.");
        }

        for (const seat of seats) {
          seat.controller.updateUsername(seat.username);
        }

        host.controller.updateSeed("dev-grid");
        await createSingleplayerHost(host.controller);

        for (const guest of guests) {
          await autoConnectGuest(host.controller, guest.controller);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to boot singleplayer grid.";
        console.error(message);
        setBootError(message);
      }
    })();

    onCleanup(() => {
      delete singleplayerWindow.__singleplayerSeats;
    });
  });

  return (
    <main class="dev-grid-shell">
      {bootError() ? (
        <div data-testid="dev-grid-error">{bootError()}</div>
      ) : null}
      <section class="dev-grid-fullscreen">
        <For each={seats}>
          {(seat) => (
            <DevGridCell seatId={seat.id}>
              <AppFrame controller={seat.controller} />
            </DevGridCell>
          )}
        </For>
      </section>
    </main>
  );
}

function DevGridCell(props: {
  seatId: string;
  children: JSX.Element;
}): JSX.Element {
  let container: HTMLDivElement | undefined;
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  const scale = createMemo(() => {
    const { width, height } = size();
    if (width === 0 || height === 0) {
      return 1;
    }
    return Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  });

  onMount(() => {
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      const box = entry?.contentRect;
      if (!box) {
        return;
      }
      setSize({
        width: box.width,
        height: box.height
      });
    });

    observer.observe(container);
    onCleanup(() => {
      observer.disconnect();
    });
  });

  return (
    <div
      ref={(node) => {
        container = node;
      }}
      data-testid={`dev-seat-${props.seatId}`}
      class="dev-grid-cell"
    >
      <div
        class="dev-grid-stage"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `translate(-50%, -50%) scale(${scale()})`
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
