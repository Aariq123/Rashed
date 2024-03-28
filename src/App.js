import { Route, Routes } from "react-router-dom";
import Navbar from "./pages/navbar";
import Home from "./pages/home";

import Productpage from "./pages/productpage";
import Contact from "./pages/contact";
import { useContext } from 'react';
import { MainContext } from './context';
import Footer from "./pages/footer";
import Cart from "./pages/cart";
import Watches from "./pages/watches";
import Glasses from "./pages/glasses";
import UserPage from "./pages/userpage";


function App() {
  const { closeMenu } = useContext(MainContext)

  return (
      <div className="App" onClick={(e) => closeMenu(e)}>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/watches" element={<Watches></Watches>}></Route>
          <Route path="/glasses" element={<Glasses></Glasses>}></Route>
          <Route path="/contact" element={<Contact></Contact>}></Route>
          <Route path="/productpage" element={<Productpage></Productpage>}></Route>
          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route path="/userpage" element={<UserPage></UserPage>}></Route>
        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
