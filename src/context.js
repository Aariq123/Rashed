import { createContext } from "react";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage'
export const MainContext = createContext()

export const ContextProvider = ({ children }) => {
  const [ menuOpen, setMenuOpen ] = useState(false)
  const [ cartItem, setCartItem ] = useState([])

  const firebaseConfig = {
    apiKey: "AIzaSyA6OJkqXfQ8HGGUJqNxxbXBG1wJotmMCX8",
    authDomain: "rashed-gayy.firebaseapp.com",
    projectId: "rashed-gayy",
    storageBucket: "rashed-gayy.appspot.com",
    messagingSenderId: "618008330965",
    appId: "1:618008330965:web:70e7cf2283b969fccad85c"
  };


  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage()
  const storageRef = ref(storage, 'watches')



  const openMenu = () =>{
    setMenuOpen(true)
  }
 

  const closeMenu = (hoho) =>{
    if(menuOpen == true){
        console.log(hoho.target.className)
      if(!hoho.target.className.includes('gay')){
        setMenuOpen(false)
      }
   }
  }


  const addCartItem = (item) => {
    setCartItem([...cartItem, item])
  }

  const removeItem = (index) => {
    setCartItem(cartItem.splice(index, index))
  }
 
    return (
        <MainContext.Provider value={{menuOpen, cartItem,removeItem, setCartItem, addCartItem, closeMenu, openMenu, setMenuOpen, storageRef, db}}>
            {children}
        </MainContext.Provider>
    )
}
