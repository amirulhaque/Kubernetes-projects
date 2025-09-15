import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

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

