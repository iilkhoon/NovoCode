import { expect, it, vi } from "vitest";
vi.mock("@webcontainer/api", () => ({ WebContainer: {} }));
vi.mock("idb-keyval", () => ({ get: vi.fn(), set: vi.fn(), del: vi.fn(), keys: vi.fn() }));
import { devCommand } from "./webcontainer";

it("runs a plain vite script through node, so a lost executable bit cannot stop it", () => {
  expect(devCommand(JSON.stringify({ scripts: { dev: "vite --host" } }))).toEqual(["node", ["node_modules/vite/bin/vite.js", "--host"]]);
  expect(devCommand(JSON.stringify({ scripts: { dev: "vite" } }))).toEqual(["node", ["node_modules/vite/bin/vite.js"]]);
});
it("leaves other scripts to npm", () => {
  expect(devCommand(JSON.stringify({ scripts: { dev: "next dev" } }))).toEqual(["npm", ["run", "dev"]]);
  expect(devCommand("not json")).toEqual(["npm", ["run", "dev"]]);
});
