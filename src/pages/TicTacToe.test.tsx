import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TicTacToe from "./TicTac"; // adjust path as needed

describe("TicTacToe Component", () => {
  it("renders initial board and buttons correctly", () => {
    render(<TicTacToe />);
    expect(screen.getAllByRole("button")).toHaveLength(11); // 9 cells + 2 header buttons
    expect(screen.getByText(/O TURN/i)).toBeInTheDocument();
    expect(screen.getByText("⟲")).toBeInTheDocument();
  });

  it("allows a move and changes turn", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    fireEvent.click(cells[0]);
    expect(cells[0].textContent).toBe("O");
    expect(screen.getByText(/X TURN/i)).toBeInTheDocument();
  });

  it("shows modal and correct winner when game is won", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    // O moves
    fireEvent.click(cells[0]); // O
    fireEvent.click(cells[3]); // X
    fireEvent.click(cells[1]); // O
    fireEvent.click(cells[4]); // X
    fireEvent.click(cells[2]); // O wins

    expect(screen.getByText(/O won the Game/i)).toBeInTheDocument(); // modal shown
    expect(screen.getByText(/Next Round/i)).toBeInTheDocument();
  });

  it("shows modal when match is tied", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    // Fill board to a tie
    const moves = [0,1,2,3,5,4,6,8,7]; // O,X,O,X,X,O,X,O,X; tie board
    moves.forEach(idx => fireEvent.click(cells[idx]));
    expect(screen.getByText(/Match tied/i)).toBeInTheDocument();
    expect(screen.getByText(/Next Round/i)).toBeInTheDocument();
  });

  it("resetGame clears the board", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    fireEvent.click(cells[0]);
    fireEvent.click(screen.getByText("⟲")); // Reset button
    cells.forEach(cell => expect(cell.textContent).toBe(""));
  });

  it("prevents moves on occupied cells", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    fireEvent.click(cells[0]); // O
    fireEvent.click(cells[0]); // Try to click same cell
    expect(cells[0].textContent).toBe("O"); // Should still be O
    expect(screen.getByText(/X TURN/i)).toBeInTheDocument(); // Turn should have changed
  });

  it("prevents moves after game ends", () => {
    render(<TicTacToe />);
    const cells = screen.getAllByRole("button").filter(btn =>
      btn.className.includes("ttt-cell")
    );
    // O wins
    fireEvent.click(cells[0]); // O
    fireEvent.click(cells[3]); // X
    fireEvent.click(cells[1]); // O
    fireEvent.click(cells[4]); // X
    fireEvent.click(cells[2]); // O wins
    
    fireEvent.click(cells[5]); // Try to make another move
    expect(cells[5].textContent).toBe(""); // Should remain empty
  });

  it("matches DOM snapshot", () => {
    const { asFragment } = render(<TicTacToe />);
    expect(asFragment()).toMatchSnapshot();
  });
});
