import axios from 'axios';
import { useState } from 'react';

export default function Register({ user }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3005/api/register',
        {
          email: email,
          password: password
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log(response.data);

      
      
    } catch (error) {
      console.log('Registreringen misslyckades', error);
    }
     
  }

  return (
    <>
      {!user && (
        <>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={handleRegister}>Register</button>
          </form>
        </>
      )}
    </>
  )
}