"use client";

import { number } from "motion";
import Image from "next/image";
import { useState } from "react";

const Button = ({text, count, setCount}) => {
  const handleClick = () => {
    if (text === '+') {
      setCount(count + 1)
    } else if (text === '-'){
      setCount(count - 1)
    } else {
      setCount(0)
    }
  }

  
  return (
    <button onClick={handleClick}>{text}</button>

  );
};


export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>
     <Button text='-' count={count} setCount={setCount}/>
     <Button text='+' count={count} setCount={setCount}/>
     <Button text='reset' count={count} setCount={setCount}/>
    </div>
  );
}
