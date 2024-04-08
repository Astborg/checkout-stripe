import{ useState } from 'react'
import Register from '../componenter/Register'
import Logout from '../componenter/Logout'
import Login from '../componenter/Login'

export default function Home() {
    const [user, setUser] = useState<string>('')
  return (
    <>
    <Register user={user} setUser={setUser}></Register>
     <Logout user={user} setUser={setUser}></Logout>
     <Login user={user} setUser={setUser}></Login></>
  )
}
