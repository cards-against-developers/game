import assert from "node:assert/strict";
import test from "node:test";

import { PeerJsEndpoint } from "./transport.js";

type HandlerMap = Record<string, Array<(...args: unknown[]) => void>>;

class FakeDataConnection {
  open = false;
  sent: string[] = [];
  closed = false;
  private handlers: HandlerMap = {};

  on(event: string, handler: (...args: unknown[]) => void): void {
    this.handlers[event] ??= [];
    this.handlers[event].push(handler);
  }

  send(data: string): void {
    this.sent.push(data);
  }

  close(): void {
    this.closed = true;
  }

  emit(event: string, ...args: unknown[]): void {
    for (const handler of this.handlers[event] ?? []) {
      handler(...args);
    }
  }
}

test("PeerJsEndpoint closes once on connection error and ignores later events", () => {
  const connection = new FakeDataConnection();
  const endpoint = new PeerJsEndpoint(connection as never);
  let closeCount = 0;
  let messageCount = 0;

  endpoint.onclose = () => {
    closeCount += 1;
  };
  endpoint.onmessage = () => {
    messageCount += 1;
  };

  connection.emit("open");
  connection.emit("error", new Error("boom"));
  connection.emit("close");
  connection.emit("data", "late");

  assert.equal(endpoint.readyState, "closed");
  assert.equal(closeCount, 1);
  assert.equal(messageCount, 0);
});

test("PeerJsEndpoint only sends while open", () => {
  const connection = new FakeDataConnection();
  const endpoint = new PeerJsEndpoint(connection as never);

  endpoint.send("ignored");
  assert.deepEqual(connection.sent, []);

  connection.open = true;
  connection.emit("open");
  endpoint.send("hello");
  assert.deepEqual(connection.sent, ["hello"]);
});
