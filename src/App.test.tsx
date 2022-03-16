import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";

import { App } from "./App";

describe("<App />", () => {
  it("renders a title, empty winner, empty board, and 9 squares", () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    expect(getByTestId("title")).toHaveTextContent("Tic Tac Toe");
    expect(getByTestId("winner")).toHaveTextContent("");
    expect(getByTestId("board")).toHaveTextContent("");
    expect(getAllByTestId("square")).toHaveLength(9);
  });

  it("renders an 'x' after clicking the first square and an 'o' after clicking the second square", async () => {
    const { getAllByTestId } = render(<App />);

    // click first square
    getAllByTestId("square")[0].click();

    // first square should now contain an 'x'
    await waitFor(() => {
      expect(getAllByTestId("square")[0]).toHaveTextContent("x");
    });

    // click second square
    getAllByTestId("square")[1].click();

    await waitFor(() => {
      // first square still contain an 'x'
      expect(getAllByTestId("square")[0]).toHaveTextContent("x");
      // second square should now contain an 'o'
      expect(getAllByTestId("square")[1]).toHaveTextContent("o");
    });
  });

  it("still renders an 'x' if first square is clicked twice", async () => {
    const { getAllByTestId } = render(<App />);

    // click first square twice
    getAllByTestId("square")[0].click();
    getAllByTestId("square")[0].click();

    // first square should now contain an 'x'
    await waitFor(() => {
      expect(getAllByTestId("square")[0]).toHaveTextContent("x");
    });
  });

  it("can determine winner by row", async () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    // x at 0,0
    getAllByTestId("square")[0].click();
    // 0 at 1,0
    getAllByTestId("square")[4].click();
    // x at 1,1
    getAllByTestId("square")[5].click();
    // o at 2,2
    getAllByTestId("square")[8].click();
    // x at 0,2
    getAllByTestId("square")[2].click();
    // o at 2,0
    getAllByTestId("square")[6].click();
    // x at 0,1
    getAllByTestId("square")[1].click();

    // x is winner, first row
    await waitFor(() => {
      expect(getByTestId("winner")).toHaveTextContent("x is the winner!");
    });
  });

  it("can determine winner by column", async () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    // x at 0,0
    getAllByTestId("square")[0].click();
    // 0 at 2,2
    getAllByTestId("square")[8].click();
    // x at 0,1
    getAllByTestId("square")[1].click();
    // o at 0,2
    getAllByTestId("square")[2].click();
    // x at 2,0
    getAllByTestId("square")[6].click();
    // o at 1,2
    getAllByTestId("square")[5].click();

    // o is winner, last column
    await waitFor(() => {
      expect(getByTestId("winner")).toHaveTextContent("o is the winner!");
    });
  });

  it("can determine winner by \\ diagonal", async () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    // x at 2,2
    getAllByTestId("square")[8].click();
    // 0 at 1,2
    getAllByTestId("square")[5].click();
    // x at 2,0
    getAllByTestId("square")[6].click();
    // o at 2,1
    getAllByTestId("square")[7].click();
    // x at 0,0
    getAllByTestId("square")[0].click();
    // o at 1,0
    getAllByTestId("square")[3].click();
    // x at 1,1
    getAllByTestId("square")[4].click();

    // x is winner, diagonal from top left to bottom right
    await waitFor(() => {
      expect(getByTestId("winner")).toHaveTextContent("x is the winner!");
    });
  });

  it("can determine winner by / diagonal", async () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    // x at 2,0
    getAllByTestId("square")[6].click();
    // 0 at 0,0
    getAllByTestId("square")[0].click();
    // x at 1,1
    getAllByTestId("square")[4].click();
    // o at 0,1
    getAllByTestId("square")[1].click();
    // x at 0,2
    getAllByTestId("square")[2].click();

    // x is winner, diagonal from top left to bottom right
    await waitFor(() => {
      expect(getByTestId("winner")).toHaveTextContent("x is the winner!");
    });
  });

  it("cannot edit board state after player has won", async () => {
    const { getByTestId, getAllByTestId } = render(<App />);

    // x at 2,0
    getAllByTestId("square")[6].click();
    // 0 at 0,0
    getAllByTestId("square")[0].click();
    // x at 1,1
    getAllByTestId("square")[4].click();
    // o at 0,1
    getAllByTestId("square")[1].click();
    // x at 0,2
    getAllByTestId("square")[2].click();

    // at this point, we expet x as the winner
    await waitFor(() => {
      expect(getByTestId("winner")).toHaveTextContent("x is the winner!");
    });

    // o at 0,2
    getAllByTestId("square")[5].click();

    // o is winner, last column
    await waitFor(() => {
      expect(getAllByTestId("square")[5]).toHaveTextContent("");
    });
  });
});
