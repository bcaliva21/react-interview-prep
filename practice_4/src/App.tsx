import { useEffect, useState } from 'react'
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
	const [bio, setBio] = useState<string>("Hello Bio");
	const [status, setStatus] = useState<Status>(Status.SAVED);

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setStatus(Status.TYPING);
		setBio(e.target.value);
	};

	useEffect(() => {
		if (status === Status.Saved) return;
		const timer = setTimeout(async () => {
			setStatus(Status.SAVING);
			try {
				const res = await fetch(POST_API_ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
						// auth stuff
					},
					body: JSON.stringify({ "bio": bio })
				});
	 			if (res.ok) {
					setStatus(Status.SAVED);
				} else {
					setStatus(Status.IDLING);
				}
			} catch (error) {
				console.error("SAVE FAILED: ", error);
				setStatus(Status.IDLING);
			}
		}, WAIT)

		return () => clearTimeout(timer);
	}, [bio]);


	return (
		<>
			<h1>Auto-Save Form</h1>
			<div>
				<h2>User Bio</h2>
				<p>Bio Status: {status}</p>
				<textarea onChange={handleBioChange} value={bio} />
			</div>
		</>
	)
}

export default App
