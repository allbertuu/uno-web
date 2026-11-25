import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/page";

test.skip("Page", () => {
  render(<Page />);

  expect(screen.getByText(/deploy now/i)).toBeInTheDocument();
});
