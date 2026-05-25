import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const inputRef = useRef(null);

  function toggleIsPaused () {
    setIsPaused(cur => !cur);
  }

  function handleInput(ref: React.Ref) {
	  if (ref.current)
	  {
		console.log("text: ", ref.current.value);
	  }
  }

	useEffect(() => {
	  if (isPaused) return;

	  let intervalId = null;
	  function incrementCounter() {
		  intervalId = setInterval(() => {
			  setCount(prevCount => prevCount + 1);
		  }, 1000)
	  };
	  incrementCounter();

	  return () => clearInterval(intervalId);
	}, [isPaused])

  return (
    <>
	  <div className="counter">count: {count} </div>
	  <button className="button" onClick={toggleIsPaused} disabled={isPaused}>{isPaused ? "Resume" : "Pause"}</button>
	  <div>
	    <h2>Input Text</h2>
	    <input ref={inputRef}></input>
	  <button className="button" onClick={() => handleInput(inputRef)} >Submit</button>
	  </div>
    </>
  )
}

export default App
