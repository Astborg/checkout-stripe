import axios from 'axios'

import { useEffect } from 'react'
import Store from './Store'


export default function Logout({user, setUser}:any) {
 
  const handleLogout = async () => {
     try {
      const response = await axios.post('http://localhost:3005/api/auth/logout', 
      {withCredentials: true 
      })
      console.log(response.data)
      if(response.status === 200){
        setUser("")
      }
      
     } catch (error) {
      console.log('utloggningen misslyckades', error)
     }
  }
 
  useEffect(() => {
    console.log('LOGOUT',user)
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3005/api/auth/amILoggedIn',
          { withCredentials: true }
        );
        if (response.status === 200) {
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
    {user && (<>
      <button onClick={handleLogout}>Logout</button>
     
      <Store></Store>
      </>
    )}
    
    </>
  )
}
