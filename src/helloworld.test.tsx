import React from "react";
import { render, screen } from "@testing-library/react";
import HelloWorld from "./helloWorld";

describe("HelloWorld Component", () => {
  it("renders the hello world message", () => {
    render(<HelloWorld />);

    const helloMessage = screen.getByText(/hello world/i);
    expect(helloMessage).toBeInTheDocument();
  });
});
