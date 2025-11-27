import React from "react";
import Navbar from "./components/Navbar.jsx"; 
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllRooms from "./pages/AllRooms.jsx";
import Footer from "./components/Footer.jsx";
import RoomDtails from "./pages/RoomDtails.jsx";
const App = () => {

  const isOwnerPath = useLocation().pathname.includes("owner");
  return (
    <div>
      {!isOwnerPath &&
      <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route  path='/' element={ <Home />} />
          <Route  path='/rooms' element={ <AllRooms />} />
          <Route  path='/rooms/:id' element={ <RoomDtails />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;