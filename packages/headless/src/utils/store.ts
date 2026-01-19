import { createStore } from "jotai";

export type NovelStore = ReturnType<typeof createStore>;

export const novelStore: NovelStore = createStore();
export * from "jotai";
