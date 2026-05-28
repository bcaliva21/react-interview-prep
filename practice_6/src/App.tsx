import { useEffect, useState } from 'react'
import DashboardProvider from './DashboardProvider'
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
			<DashboardProvider />
		</>
	)
}

export default App
