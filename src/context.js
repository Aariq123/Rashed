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
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)

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
  const auth = getAuth();



  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        /*  getDoc(doc(db, 'signed users', user.uid))
          .then((res)=>{
            setUserDetails(res.data()) 
          }) */
      } else {
        setUser(null)
        //   setUserDetails(null)
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
    console.log(item)
    if (cartItem.length == 0) {
      setCartItem([...cartItem, item])
    }
    cartItem.forEach(product => {
      if (product.id == item.id && product.category == item.category) {
        product.quantity++
      } else if (product.id !== item.id) {
        setCartItem([...cartItem, item])
      }
    })
  }



  const removeItem = (index) => {
    setCartItem(cartItem.filter((item, i) => i !== index))
  }


  return (
    <MainContext.Provider value={{ user, setUser, setUserDetails, userDetails, app, matches, matches2, menuOpen, cartItem, removeItem, setCartItem, addCartItem, closeMenu, openMenu, setMenuOpen, storageRef, db }}>
      {children}
    </MainContext.Provider>
  )
}
