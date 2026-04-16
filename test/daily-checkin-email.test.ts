import { describe, expect, it } from "vitest";
import {
  buildCheckinEmailHtml,
  buildCheckinEmailSubject,
} from "../supabase/functions/send-daily-checkin/email-template";

describe("daily check-in email", () => {
  describe("buildCheckinEmailSubject", () => {
    it("returns the email subject", () => {
      expect(buildCheckinEmailSubject()).toBe("Your Daily Check-In Reminder");
    });
  });

  describe("buildCheckinEmailHtml", () => {
    const appUrl = "http://localhost:3000";

    it("contains a link to the app", () => {
      const html = buildCheckinEmailHtml(appUrl);
      expect(html).toContain(`href="${appUrl}"`);
    });

    it("includes a call to action for the check-in", () => {
      const html = buildCheckinEmailHtml(appUrl);
      expect(html).toContain("check-in");
    });

    it("returns a complete HTML document", () => {
      const html = buildCheckinEmailHtml(appUrl);
      expect(html).toMatch(/^<!DOCTYPE html>/i);
      expect(html).toContain("</html>");
    });

    it("uses the AFH crimson brand color", () => {
      const html = buildCheckinEmailHtml(appUrl);
      expect(html).toContain("#db2350");
    });

    it("uses the AFH body text color", () => {
      const html = buildCheckinEmailHtml(appUrl);
      expect(html).toContain("#392e44");
    });
  });
});
