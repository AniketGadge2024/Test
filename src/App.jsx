import React from 'react'
import Dash from './Component/DashBoard/Dash'
import Qrgen from './Component/QrGenerator/Qrgen'
import AddItem from './Component/AddItem/AddItem'
import Login from './Component/Admin/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
<Router>

<Routes>
  <Route path='/' element={ <Login></Login>}/>
  <Route path='/Dash' element={<Dash></Dash>}/>
  <Route path='/Qr' element={  <Qrgen></Qrgen>}/>
  <Route path='/Add' element={ <AddItem></AddItem>}/>
</Routes>

</Router>



     
    
    
    
    </div>
  )
}

export default App
