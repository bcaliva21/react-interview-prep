import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error';
  read: boolean;
  timestamp: number;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface UserContextType {
  user: { name: string; role: string };
  updateUser: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState({ name: 'Alex Senior', role: 'Administrator' });

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  const updateUser = (name: string) => setUser((prev) => ({ ...prev, name }));

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  const userValue = useMemo(() => ({ user, updateUser }), [user, updateUser])

  return (
    <UserContext.Provider value={userValue}>
	  <ThemeContext.Provider value={themeValue}>
		  <div style={{ 
			background: theme === 'dark' ? '#1e1e1e' : '#fff', 
			color: theme === 'dark' ? '#fff' : '#000',
			minHeight: '100vh',
			padding: '24px',
			fontFamily: 'sans-serif'
		  }}>
			{children}
		  </div>
	  </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, message: 'Server CPU utilization at 92%', type: 'warning', read: false, timestamp: Date.now() - 60000 },
  { id: 2, message: 'New user registration successful', type: 'info', read: true, timestamp: Date.now() - 120000 },
  { id: 3, message: 'Database backup failed!', type: 'error', read: false, timestamp: Date.now() - 180000 },
  { id: 4, message: 'SSL certificate expiring in 5 days', type: 'warning', read: false, timestamp: Date.now() - 240000 },
];

export default function App() {
  return (
    <DashboardProvider>
      <NotificationDashboard initialNotifications={MOCK_NOTIFICATIONS} />
    </DashboardProvider>
  );
}

interface DashboardProps {
  initialNotifications: Notification[];
}

function NotificationDashboard({ initialNotifications }: DashboardProps) {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('DashboardContext missing');
  const { theme, toggleTheme } = context;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
		setNotifications(prev => prev.map(n => ({...n, read: true})));
        console.log('Cleared notifications via Escape key');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
	
	return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const processedNotifications = () => {
    console.log('Performing heavy filtering/sorting computation...');
    let result = [...notifications];
    if (filter === 'unread') {
      result = result.filter((n) => !n.read);
    }
    return result.sort((a, b) => b.timestamp - a.timestamp);
  };

	const displayedNotifications = useMemo(() => processedNotifications(),[notifications]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>System Control Panel</h2>
        <button onClick={toggleTheme} style={{ padding: '8px 16px' }}>
          Toggle Theme ({theme})
        </button>
      </div>

      <UserProfileCard />

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setFilter('all')} 
          style={{ fontWeight: filter === 'all' ? 'bold' : 'normal', padding: '6px 12px' }}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setFilter('unread')} 
          style={{ fontWeight: filter === 'unread' ? 'bold' : 'normal', padding: '6px 12px' }}
        >
          Unread Only
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {displayedNotifications.map((n) => (
          <div key={n.id} style={{ border: '1px solid #444', padding: '12px', borderRadius: '4px', position: 'relative' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: n.type === 'error' ? 'red' : n.type === 'warning' ? 'orange' : 'gray',
              textTransform: 'uppercase'
            }}>
              {n.type}
            </span>
            <p style={{ margin: '4px 0' }}>{n.message}</p>
            {!n.read && (
              <button 
                onClick={() => {
                  setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                }}
                style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px' }}
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UserProfileCard() {
  const context = useContext(UserContext);
  if (!context) throw new Error('DashboardContext missing');
  const { user, updateUser } = context;

  console.log('UserProfileCard rendered!');

  return (
    <div style={{ padding: '16px', border: '1px dashed #888', borderRadius: '6px', marginBottom: '20px' }}>
      <h3>User Session</h3>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
      <input 
        type="text" 
        value={user.name} 
        onChange={(e) => updateUser(e.target.value)} 
        placeholder="Edit profile name"
        style={{ padding: '6px', width: '100%', boxSizing: 'border-box' }}
      />
    </div>
  );
}
