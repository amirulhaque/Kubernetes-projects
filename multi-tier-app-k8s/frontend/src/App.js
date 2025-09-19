import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  // ✅ First check runtime env (window._env_), fallback to build-time env
  const apiUrl = window._env_?.REACT_APP_API_URL || process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(apiUrl + '/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, [apiUrl]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>🚗 Car Service Frontend</h1>
      <h2>Fetched Users from Backend:</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user, i) => <li key={i}>{user.name}</li>)
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
