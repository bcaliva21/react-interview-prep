import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  tags: string[];
}

const fetchProductsMock = (query: string): Promise<Product[]> => {
  const latency = query === 'laptop' ? 2000 : 300; 
  return new Promise((resolve) => {
    setTimeout(() => {
      const allProducts: Product[] = [
        { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1200, tags: [] },
        { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 40, tags: [] },
        { id: 3, name: 'Mechanical Keyboard', category: 'Electronics', price: 100, tags: [] },
        { id: 4, name: 'Leather Jacket', category: 'Apparel', price: 250, tags: [] },
        { id: 5, name: 'Running Shoes', category: 'Apparel', price: 80, tags: [] },
      ];
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, latency);
  });
};

const useProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
	  const timeout = setTimeout(() => {
		fetchProductsMock(searchTerm).then((data) => {
		  setProducts([...data]);
		  setLoading(false);
		});
	  }, 400);

	  return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleAddTag = (productId: number, newTag: string): void => {
    if (!newTag.trim()) return;

	setProducts(previousProducts => 
		previousProducts.map(product => 
			product.id === productId
				? { ...product, tags: [...product.tags, newTag] }
				: product
		)
	 );
  };

  return {
	handleAddTag,
	loading,
	products,
	searchTerm,
	setProducts,
	setSearchTerm
  };
};

export default function ProductDashboard() {
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const { handleAddTag, loading, products, searchTerm, setProducts, setSearchTerm } = useProductSearch();

  useEffect(() => {
    const interval = setInterval(() => {
	  setRefreshCount(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Product Catalog Dashboard</h2>
      <p style={{ fontSize: '12px', color: '#666' }}>Auto-refreshed cycles: {refreshCount}</p>
      
      <input
        type="text"
        placeholder="Search products (Try typing 'laptop' quickly then clearing it)..."
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }}
      />

      {loading && <p>Loading products...</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!loading && products.length === 0 && <p>No products found.</p>}
        {!loading && products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddTag={handleAddTag} 
          />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddTag: (productId: number, newTag: string) => void;
}

function ProductCard({ product, onAddTag }: ProductCardProps) {
  const [tagInput, setTagInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onAddTag(product.id, tagInput);
    setTagInput('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{product.name}</h4>
        <span style={{ fontWeight: 'bold' }}>${product.price}</span>
      </div>
      <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>Category: {product.category}</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
        {product.tags.map((tag, idx) => (
          <span key={idx} style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
            {tag}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Add tag"
          value={tagInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
          style={{ padding: '4px', flex: 1 }}
        />
        <button type="submit" style={{ padding: '4px 12px' }}>Add</button>
      </form>
    </div>
  );
}
