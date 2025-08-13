import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders TicTacToe component", () => {
    render(<App />);
    expect(screen.getByText(/O TURN/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});