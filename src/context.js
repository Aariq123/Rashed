import { createContext, useEffect } from "react";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage'
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const MainContext = createContext()


export const ContextProvider = ({ children }) => {
  const matches = useMediaQuery('(min-width:460px)');
  const matches2 = useMediaQuery('(min-width:900px)');
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartItem, setCartItem] = useState([])
  const [cartItemInitial, setCartItemInitial] = useState([])
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };


  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage()
  const storageRef = ref(storage, 'watches')
  const auth = getAuth();



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    });
  }, [])



  useEffect(() => {
    if (user) {
      onSnapshot(doc(db, 'signed users', user.uid), (doc) => {
        setUserDetails(doc.data())
      })
    }
  }, [user])


  console.log(userDetails)


  const openMenu = () => {
    setMenuOpen(true)
  }


  const closeMenu = (hoho) => {
    if (menuOpen == true) {
      console.log(hoho.target.className)
      if (!hoho.target.className.includes('gay')) {
        setMenuOpen(false)
      }
    }
  }


  const addCartItem = (item) => {
    if(cartItem.length > 0){
      cartItem.forEach(product=>{
        if(product.id == item.id && product.category == item.category){
          product.quantity += item.quantity
        }else{
          setCartItem([...cartItem, item])
        }
      })
    }else{
      setCartItem([...cartItem, item])
    }
  }



  const removeItem = (index) => {
    setCartItem(cartItem.filter((item, i) => i !== index))
  }


  return (
    <MainContext.Provider value={{ user, setCartItemInitial, setUser, setUserDetails, userDetails, app, matches, matches2, menuOpen, cartItem, removeItem, setCartItem, addCartItem, closeMenu, openMenu, setMenuOpen, storageRef, db }}>
      {children}
    </MainContext.Provider>
  )
}
