import React, { useState, useEffect, useCallback } from 'react';

interface ItemDetails {
  stock: number;
  price: number;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  details: ItemDetails;
}

const fetchItemDetailsMock = (id: string): Promise<string> => {
  const latency = id === '1' ? 2500 : 400;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Deep-dive analysis report for Item ${id}: Optimal shelf placement verified.`);
    }, latency);
  });
};

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', details: { stock: 15, price: 99 } },
  { id: '2', name: 'Ergonomic Desk Chair', category: 'Furniture', details: { stock: 4, price: 249 } },
  { id: '3', name: 'Smart Fitness Watch', category: 'Electronics', details: { stock: 8, price: 149 } },
];

export default function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [itemReport, setItemReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState<boolean>(false);
  const [totalValue, setTotalValue] = useState<number>(calculateTotalValue());

  function calculateTotalValue (): number {
    let sum = 0;
	if (!items) return 0;

    for (const item of items) {
      sum += item.details.stock * item.details.price;
    }
	
	return sum;
  };

  useEffect(() => {
    setTotalValue(calculateTotalValue());
  }, [items]);

  useEffect(() => {
    setLoadingReport(true);

	  const timeout = setTimeout(() => {
		fetchItemDetailsMock(selectedId).then((report) => {
		  console.log("report: ", report);
		  setItemReport(report);
	  	  setLoadingReport(false);
		});
	  }, 500);

	  return () => clearTimeout(timeout);
  }, [selectedId]);

  const handleAuditLog = useCallback(() => {
    console.log(`Inventory Audit Triggered. Total unique SKUs managed: ${items.length}`);
  }, [items]);

  const handleRestock = (id: string): void => {
    setItems(previousItems =>
	  previousItems.map(item =>
		  item.id === id
		    ? { ...item, details: { ...item.details, stock: item.details.stock + 5 } }
			: item
	  )
    );
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Warehouse Inventory Management</h2>
      
      <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
        <strong>Financial Metric:</strong> Total Portfolio Value: ${totalValue}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Stock Ledger</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedId(item.id)}
                style={{ 
                  border: '1px solid #ccc', 
                  padding: '12px', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedId === item.id ? '#e3f2fd' : 'transparent'
                }}
              >
                <h4 style={{ margin: '0 0 8px 0' }}>{item.name}</h4>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>In Stock: {item.details.stock}</p>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>Price: ${item.details.price}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestock(item.id);
                  }}
                  style={{ marginTop: '8px', padding: '4px 8px' }}
                >
                  Restock (+5)
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Item Inspection Panel</h3>
          <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '6px', minHeight: '150px' }}>
            {loadingReport ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Loading inspection details...</p>
            ) : (
              <p>{itemReport || 'Select an item to view its automated report.'}</p>
            )}
          </div>
          
          <button 
            onClick={handleAuditLog}
            style={{ marginTop: '16px', width: '100%', padding: '10px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Run System Audit Log
          </button>
        </div>
      </div>
    </div>
  );
}
