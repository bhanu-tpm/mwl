import { describe, expect, it } from "vitest";
import { clientIp, consumeDemoRunInMemory, hashIp } from "@/services/rate-limit";

const h = (o: Record<string, string>) => new Headers(o);

describe("clientIp", () => {
  it("uses the proxy-appended (last) x-forwarded-for entry, ignoring a spoofed first hop", () => {
    expect(clientIp(h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }), undefined)).toBe("203.0.113.9");
  });

  it("ignores platform headers unless they are explicitly trusted", () => {
    const headers = h({ "cf-connecting-ip": "198.51.100.1", "x-forwarded-for": "203.0.113.9" });
    expect(clientIp(headers, undefined)).toBe("203.0.113.9");
    expect(clientIp(headers, "cf-connecting-ip")).toBe("198.51.100.1");
  });

  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(h({ "x-real-ip": "192.0.2.4" }), undefined)).toBe("192.0.2.4");
    expect(clientIp(h({}), undefined)).toBe("unknown");
  });
});

describe("hashIp", () => {
  it("is stable, salted, and never contains the raw IP", () => {
    const a = hashIp("1.1.1.1");
    expect(a).toBe(hashIp("1.1.1.1"));
    expect(a).not.toBe(hashIp("1.1.1.2"));
    expect(a).toHaveLength(32);
    expect(a).not.toContain("1.1.1.1");
  });
});

describe("in-memory demo limiter (limits from vitest env: 2/hour per visitor, 3/day)", () => {
  it("enforces the hourly and daily caps and resets the next day", () => {
    const t0 = Date.parse("2026-10-03T10:00:00Z");
    const a = hashIp("10.0.0.1");
    const b = hashIp("10.0.0.2");
    const run = (who: string, t: number) => {
      const r = consumeDemoRunInMemory(who, t);
      return r.ok ? "ok" : r.reason;
    };
    expect([run(a, t0), run(a, t0 + 1), run(a, t0 + 2)]).toEqual(["ok", "ok", "rate_limited"]);
    expect([run(b, t0 + 3), run(b, t0 + 4)]).toEqual(["ok", "daily_limit"]);
    expect(run(a, t0 + 24 * 3600e3)).toBe("ok");
  });
});
