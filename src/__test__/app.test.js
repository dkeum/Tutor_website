// sum.test.js or Counter.test.js
import { cleanup, fireEvent, render } from "@testing-library/react";
import { describe, expect, test } from "@jest/globals";
import React from "react";
import Counter from "../components/Counter";
import sum from "../helperFunctions/sum";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

describe("Counter component", () => {
  it("displays the correct initial value", () => {
    const { getByTestId } = render(<Counter initialcount={0} />);
    const countValue = Number(getByTestId("count").textContent);
    expect(countValue).toBe(0); // Use string comparison unless it's parsed
  });

  it("should increment by 1 if we click on the increment button is clicked", () => {
    const { getByTestId, getByRole } = render(<Counter initialcount={0} />);
    const incrementBtn = getByRole("button", {name:"increment"})
    
    fireEvent.click(incrementBtn)
    const countValue = Number(getByTestId("count").textContent);
    expect(countValue).toBe(1); // Use string comparison unless it's parsed
  });
});
