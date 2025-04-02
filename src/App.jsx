import React from 'react'
import Dash from './Component/DashBoard/Dash'
import Qrgen from './Component/QrGenerator/Qrgen'
import AddItem from './Component/AddItem/AddItem'

const App = () => {
  return (
    <div>
     <Qrgen></Qrgen>
     <AddItem></AddItem>
    </div>
  )
}

export default App
