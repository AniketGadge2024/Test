import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Message from './Components/Message';

const App = () => {
  return (
    <div>
<Router>

<Routes>
  <Route path='/' element={<Login></Login> }/>
  <Route path='/message' element={<Message></Message> }/>
  
</Routes>

</Router>



     
    
    
    
    </div>
  )
}

export default App
