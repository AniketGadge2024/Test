import React from 'react'
import Dash from './Component/DashBoard/Dash'
import Qrgen from './Component/QrGenerator/Qrgen'
import AddItem from './Component/AddItem/AddItem'
import Login from './Component/Admin/Login'

const App = () => {
  return (
    <div>
      <Login></Login>
      <Dash></Dash>
     <Qrgen></Qrgen>
     <AddItem></AddItem>
    </div>
  )
}

export default App
