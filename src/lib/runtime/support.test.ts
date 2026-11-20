import { expect, it } from "vitest";
import { previewSupport } from "./support";
it("explains HTTP LAN access rather than blaming the browser", () => {
  expect(previewSupport({ isSecureContext: false, crossOriginIsolated: false })?.message).toContain("localhost:3000");
});
it("identifies missing isolation headers in a secure context", () => {
  expect(previewSupport({ isSecureContext: true, crossOriginIsolated: false })?.message).toContain("COOP");
});
it("allows isolated secure pages", () => {
  expect(previewSupport({ isSecureContext: true, crossOriginIsolated: true })).toBeNull();
});
