import { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'

// Debounced Network Requests:
// Implement a custom search input.
// As the user types, do not fire an API call on every keystroke. Debounce the API request by 300ms.

export const fetchSuggestions = async (query: string, signal: AbortSignal): Promise<string[]> => {
  const mockData = [
    "react", "react native", "react router", "redux", "recoil",
    "javascript", "typescript", "vue", "angular", "next.js"
  ];

  const randomLatency = Math.floor(Math.random() * 1000) + 200;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, randomLatency);

    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
};

type CacheData = Record<string, string[]>;

function useCache() {
	const cache = useRef<CacheData>({});

	const getCache = useCallback((key: string): string[] | undefined => {
		return cache.current[key];
	}, []);

	const setCache = useCallback((key: string, value: string): void => {
		cache.current[key] = value;
	}, [])

	return [getCache, setCache];
}

function App() {
  const [ search, setSearch ] = useState<string>('');
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const [ controller ] = useState<AbortController>(new AbortController());
  const [ codingList, setCodingList ] = useState<string[]>([]);
  const [ getCache, setCache ] = useCache();

  useEffect(() => {
	  let isCurrentRequest = true;
	  setLoading(true);
	  setError(false);

	  const cachedValue = getCache(search);

	  if (cachedValue !== undefined) {
		  setCodingList([...cachedValue]);
		  setLoading(false);
		  return;
	  }

	  const timeout = setTimeout(() => {
		  fetchSuggestions(search, controller.signal)
			.then((data) => {
				if (isCurrentRequest) {
					setCache(search, data);
					setCodingList([...data])
				}
			})
			.catch(error => {
			  setError(true);
			  if (error instanceof Error) {
				  console.error(error.message);
				  setErrorMessage(error.message);
			  } else {
				  const unknownError = "Unknown error!";
				  console.error(unknownError );
				  setErrorMessage(unknownError);
			  }
		    })
			.finally(() => setLoading(false));
	  }, 300);

	  return () => {
		  clearTimeout(timeout);
		  isCurrentRequest = false;
	  }
  }, [search])

  return (
    <>
		<h1>Custom Search</h1>
		<div>
	      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}></input>
		  <span>Search Term: {search}</span>
		</div>
		<ul>
		  {loading && <div>Loading...</div>}
		  {error && <div>{errorMessage}</div>}
		  {(!loading && !error && codingList) && codingList.map((item, index) => <li key={item + index}>{item}</li>)}
		</ul>
    </>
  )
}

export default App
