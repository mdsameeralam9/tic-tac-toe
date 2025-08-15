import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TicTacToe from "./TicTac";

describe("TicTacToe Component", () => {
  test("renders initial board and UI elements", () => {
    render(<TicTacToe />);
    
    // Check title exists
    expect(screen.getByText(/tic tac toe game/i)).toBeTruthy();
    
    // Check 9 cells exist
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    expect(cells).toHaveLength(9);
    
    // Check initial turn
    expect(screen.getByText(/O TURN/i)).toBeTruthy();
  });

  test("places marks alternately on cell clicks", () => {
    render(<TicTacToe />);
    
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    
    // Click first cell - should place O
    fireEvent.click(cells[0]);
    expect(cells[0].textContent).toBe("O");
    expect(screen.getByText(/X TURN/i)).toBeTruthy();
    
    // Click second cell - should place X
    fireEvent.click(cells[1]);
    expect(cells[1].textContent).toBe("X");
    expect(screen.getByText(/O TURN/i)).toBeTruthy();
  });

  test("detects winner correctly", () => {
    render(<TicTacToe />);
    
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    
    // O wins on first row
    fireEvent.click(cells[0]); // O
    fireEvent.click(cells[3]); // X
    fireEvent.click(cells[1]); // O
    fireEvent.click(cells[4]); // X
    fireEvent.click(cells[2]); // O wins
    
    expect(screen.getByText(/O won the Game/i)).toBeTruthy();
  });

  test("detects tie correctly", () => {
    render(<TicTacToe />);
    
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    
    // Create a tie scenario
    const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
    moves.forEach(idx => fireEvent.click(cells[idx]));
    
    expect(screen.getByText(/Match tied/i)).toBeTruthy();
  });

  test("reset button clears the board", () => {
    render(<TicTacToe />);
    
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    
    // Make some moves
    fireEvent.click(cells[0]);
    fireEvent.click(cells[1]);
    
    // Reset
    const resetBtn = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetBtn);
    
    // Check board is cleared
    cells.forEach(cell => expect(cell.textContent).toBe(""));
    expect(screen.getByText(/O TURN/i)).toBeTruthy();
  });

  test("prevents moves on occupied cells", () => {
    render(<TicTacToe />);
    
    const cells = screen.getAllByRole("button").filter(btn => 
      btn.getAttribute("aria-label")?.includes("Cell")
    );
    
    fireEvent.click(cells[0]); // O
    fireEvent.click(cells[0]); // Try again
    
    expect(cells[0].textContent).toBe("O");
    expect(screen.getByText(/X TURN/i)).toBeTruthy();
  });
});