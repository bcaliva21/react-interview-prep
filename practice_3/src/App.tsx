import { useEffect, useState } from 'react'
import './App.css'

interface Product {
	id: number;
	price: number;
	title: string;
	[key: string]: any; // catchall
}

const API_ROUTE = "https://dummyjson.com/products?limit=10&skip=";
const MAX_PAGE = 19;

function App() {
	const [page, setPage] = useState<number>(0);
	const [products, setProducts] = useState<Product[]>([]);

	function handleMove(direction: 'next' | 'previous') {
		if (direction === "next") {
			setPage(cur => cur+1);
		} else {
			setPage(cur => cur-1);
		}
	};

	useEffect(() => {
		async function fetchProducts() {
			const skip = page * 10;
			const endpoint = API_ROUTE + skip;
			const res = await fetch(endpoint);
			const _products = await res.json()
			setProducts(_products.products);
		}

		fetchProducts();
	}, [page]);

  return (
    <>
	  <div>Current Page: {page}</div>
	  <button disabled={page >= MAX_PAGE} onClick={() => handleMove('next')}>Next</button>
	  <button disabled={page <= 0} onClick={() => handleMove('previous')}>Previous</button>
	  <ul>{products.length > 0 && products.map(product => <li key={product.id}><b>Title:</b> {product.title} <i>Price:</i> {product.price}</li>)}
	  </ul>
    </>
  )
}

export default App
