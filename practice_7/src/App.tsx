import { useEffect, useState } from 'react'
import InventoryManagement from './InventoryManagement'
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
			<InventoryManagement />
		</>
	)
}

export default App
