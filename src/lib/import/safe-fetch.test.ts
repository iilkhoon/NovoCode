import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { _privateIp, assertPublicUrl } from "./safe-fetch";

describe("safe fetch", () => {
  it("detects private addresses", () => {
    for (const ip of ["127.0.0.1", "10.1.2.3", "192.168.0.10", "172.20.1.1", "169.254.169.254", "::1", "fd00::1", "::ffff:127.0.0.1", "100.64.0.1"]) expect(_privateIp(ip)).toBe(true);
    for (const ip of ["8.8.8.8", "93.184.216.34", "2606:4700::1111"]) expect(_privateIp(ip)).toBe(false);
  });
  it("refuses local and non-http targets", async () => {
    await expect(assertPublicUrl("http://localhost:3000")).rejects.toThrow();
    await expect(assertPublicUrl("http://127.0.0.1/admin")).rejects.toThrow();
    await expect(assertPublicUrl("http://169.254.169.254/latest/meta-data")).rejects.toThrow();
    await expect(assertPublicUrl("file:///etc/passwd")).rejects.toThrow();
    await expect(assertPublicUrl("http://user:pw@example.com")).rejects.toThrow();
  });
});
