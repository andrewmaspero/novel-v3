import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { novelStore } from "../utils/store";
import { queryAtom, rangeAtom } from "../utils/atoms";

afterEach(() => {
  cleanup();
  novelStore.set(queryAtom, "");
  novelStore.set(rangeAtom, null);
});

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const [message] = args;
  if (typeof message === "string" && message.includes("Duplicate extension names")) {
    return;
  }
  originalWarn(...args);
};

if (!globalThis.matchMedia) {
  globalThis.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof globalThis.matchMedia;
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}

class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL(_file: Blob) {
    this.result = "data:image/png;base64,MOCK";
    queueMicrotask(() => {
      this.onload?.({ target: this } as ProgressEvent<FileReader>);
    });
  }
}

// @ts-expect-error allow global assignment for test environment
globalThis.FileReader = MockFileReader;
