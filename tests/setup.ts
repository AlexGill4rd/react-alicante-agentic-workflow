import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library's automatic cleanup only runs when Vitest globals are on,
// so unmount between tests here instead.
afterEach(cleanup);
