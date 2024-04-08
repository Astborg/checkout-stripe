import axios from 'axios'
import { useEffect, useState} from 'react';


export default function Login({user, setUser}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
     try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
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
      const data = await response.data
      if(response.status === 200) {
        setUser(data)
      }else{
        setUser('')
      }
      
     } catch (error) {
      alert('fel email eller lösenord')
      console.log('inloggningen misslyckades', error)
     }
  }
 
  useEffect(() => {
    console.log('LOGG IN', user)
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/auth/amILoggedIn',
          { withCredentials: true }
        );
        if (response.status === 200 && response.data !== "") {
          setUser(response.data);
        } else {
          setUser('');
        }
      } catch (error) {
      
        console.log('Kunde inte verifiera inloggning', error);
      }
    };

    checkLoggedInStatus();
  }, [ setUser]);
  
  
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
            <button type="submit" onClick={handleLogin}>Login</button>
          </form>
    
    </>
    )}
    </>
  )
}
