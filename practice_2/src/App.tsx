import { useEffect, useState } from 'react'
import './App.css'

const API_ENDPOINT = "https://swapi.py4e.com/api/people/";

function App() {
	const [query, setQuery] = useState<string>("");
	const [data, setData] = useState<Array>([]);

	useEffect(() => {
		async function callApi(_query: string) {
			const endpointWithSearchParam = API_ENDPOINT + `?search=${_query}`;
			const res = await fetch(endpointWithSearchParam);
			const body = await res.json();
			setData([...body.results]);
		}

		callApi(query);
	}, [query]);

	return (
		<>
			<div className="hero">
				<input placeholder="Search query" onChange={(e) => setQuery(e.target.value)} value={query}></input>
			</div>
			<ul className="">{data.map(item => <li key={item.url}>{item.name}</li>)}</ul>
		</>
	)
}

export default App
