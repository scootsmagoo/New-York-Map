import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("CI workflows", () => {
  it("run in the Playwright image that matches the installed @playwright/test", () => {
    const { version } = JSON.parse(fs.readFileSync("node_modules/@playwright/test/package.json", "utf8"));
    for (const file of ["deploy.yml", "ci.yml"]) {
      const yml = fs.readFileSync(`.github/workflows/${file}`, "utf8");
      // A mismatched image lacks the browser builds this version expects.
      expect(yml, file).toContain(`mcr.microsoft.com/playwright:v${version}-noble`);
    }
  });
});
