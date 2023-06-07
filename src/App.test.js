import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "./App";
describe("App", () => {
    it("Renders hello-yo", () => {
        // ARRANGE
        render(_jsx(App, {}));
        // ACT
        // EXPECT
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hello yo :)");
    });
});
