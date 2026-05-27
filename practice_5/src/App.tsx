import { useEffect, useState } from 'react'
import ProductDashboard from './ProductDashboard'
import './App.css'

enum Status {
	IDLING = "Idling",
	TYPING = "Typing...",
	SAVING = "Saving...",
	SAVED = "Saved",
}

const POST_API_ENDPOINT = "https://httpbin.org/post"
const WAIT = 1000;

function App() {
	return (
		<>
			<ProductDashboard />
		</>
	)
}

export default App
