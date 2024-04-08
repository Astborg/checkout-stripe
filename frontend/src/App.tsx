import {Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import Confirmation from './pages/confirmation'



function App() {
  return (
 
   <Routes>
    <Route path='/confirmation' element={<Confirmation></Confirmation>}/>
    <Route path='/' element={<Home></Home>}></Route>
    </Routes>   
  )
}

export default App
