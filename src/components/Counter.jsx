import React, { useState } from "react";

const Counter = ({ initialcount }) => {
  const [count, setCount] = useState(initialcount);

  function handleClick() {
    setCount((prev) => prev + 1);
  }

  return (
    <div>
      <h1 data-testid="count">{count}</h1>

      <div>
        <button onClick={handleClick}>increment</button>
      </div>
    </div>
  );
};

export default Counter;
