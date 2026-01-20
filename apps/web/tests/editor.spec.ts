import { test, expect, type Page } from "@playwright/test";
const getEditor = (page: Page) => page.locator('[contenteditable="true"]').first();

const waitForEditor = async (page: Page) => {
  const editor = getEditor(page);
  await expect(editor).toBeVisible();
  return editor;
};

test("editor typing + basic formatting", async ({ page }) => {
  await page.goto("/");
  const editor = await waitForEditor(page);

  await editor.click();
  await page.keyboard.type("Hello ");

  await page.keyboard.press("Meta+B");
  await page.keyboard.type("Bold");
  await page.keyboard.press("Meta+B");

  await page.keyboard.press("Meta+I");
  await page.keyboard.type(" Italic");
  await page.keyboard.press("Meta+I");

  await expect(page.locator("strong", { hasText: "Bold" })).toBeVisible();
  await expect(page.locator("em", { hasText: "Italic" })).toBeVisible();
});

test("slash command inserts heading", async ({ page }) => {
  await page.goto("/");
  const editor = await waitForEditor(page);

  await editor.click();
  await page.keyboard.type("\n/heading 2");
  await page.keyboard.press("Enter");

  await page.keyboard.type("Slash Heading");
  await expect(page.locator("h2", { hasText: "Slash Heading" })).toBeVisible();
});

test("bubble menu + math conversion", async ({ page }) => {
  await page.goto("/");
  const editor = await waitForEditor(page);

  await editor.click();
  await page.keyboard.type("\nE=mc^2");
  const katexBefore = await page.locator(".ProseMirror .katex").count();

  await page.keyboard.down("Shift");
  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press("ArrowLeft");
  }
  await page.keyboard.up("Shift");

  const askAi = page.getByRole("button", { name: /ask ai/i });
  await expect(askAi).toBeVisible();

  const bubbleMenu = askAi.locator("..");
  await bubbleMenu.locator("button.w-12").click();
  await expect(page.locator(".ProseMirror .katex")).toHaveCount(katexBefore + 1);
});

test("image upload + resizer handles", async ({ page }) => {
  const dataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9lJdQAAAAASUVORK5CYII=";

  await page.route("**/api/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ url: dataUrl }),
    });
  });

  await page.goto("/");
  const editor = await waitForEditor(page);

  await editor.click();
  await page.keyboard.type("\nImage paste test");

  const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO9lJdQAAAAASUVORK5CYII=";

  await page.evaluate((b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const file = new File([bytes], "tiny.png", { type: "image/png" });
    const dt = new DataTransfer();
    dt.items.add(file);
    const event = new ClipboardEvent("paste", {
      clipboardData: dt,
      bubbles: true,
    });
    const editor = document.querySelector('[contenteditable="true"]');
    editor?.dispatchEvent(event);
  }, base64);

  const uploaded = page.locator('.ProseMirror img[src^="data:image"]').first();
  await expect(uploaded).toBeVisible();

  await uploaded.click();
  await expect(uploaded).toHaveClass(/ProseMirror-selectednode/);
});

test("theme switcher toggles dark mode", async ({ page }) => {
  await page.goto("/");
  await waitForEditor(page);

  const menuButton = page.locator("button:has(svg.lucide-menu)").first();
  await menuButton.click();
  const darkButton = page.getByRole("button", { name: "Dark" });
  await expect(darkButton).toBeVisible();
  await darkButton.click({ force: true });
  await expect(page.locator("html")).toHaveClass(/dark/);

  await menuButton.click();
  const lightButton = page.getByRole("button", { name: "Light" });
  await expect(lightButton).toBeVisible();
  await lightButton.click({ force: true });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("no hydration warnings on load", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (/hydration|cannot be a descendant/i.test(text)) {
        hydrationErrors.push(text);
      }
    }
  });

  await page.goto("/");
  await waitForEditor(page);
  await page.waitForTimeout(500);

  expect(hydrationErrors).toEqual([]);
});
