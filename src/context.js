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
  const [count, setCount] = useState(0)

  const firebaseConfig = {
    /*
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
*/


    apiKey: "AIzaSyA6OJkqXfQ8HGGUJqNxxbXBG1wJotmMCX8",
    authDomain: "rashed-gayy.firebaseapp.com",
    databaseURL: "https://rashed-gayy-default-rtdb.asia-southeast1.firebasedatabase.app",
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


  console.log(userDetails)
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
      onSnapshot(doc(db, 'signedUsers', user.uid),
        (doc) => {
          setUserDetails(doc.data())
        },
        (err) => { console.log(err) }
      )
    }
  }, [user])



  useEffect(() => {
    console.log(userDetails)
  }, [userDetails])

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


    if (cartItem.length < 1) {
      setCartItem([...cartItem, item])
      setCount(1)
    } else {
      cartItem.forEach(product => {
        if (product.id == item.id && product.category == item.category) {
          console.log('ligma')
          if ((product.quantity + item.quantity) <= product.data.stock) {
            product.quantity += item.quantity
          } else {
            product.quantity = product.data.stock
          }
        } else {
          setCartItem([...cartItem, item])
          setCount(count + 1)
        }
      })
    }
  }
  console.log(count)
  const removeItem = (index) => {
    setCartItem(cartItem.filter((item, i) => i !== index))
  }


  return (
    <MainContext.Provider value={{ user, setCartItemInitial, setUser, setUserDetails, userDetails, app, matches, matches2, menuOpen, cartItem, removeItem, setCartItem, addCartItem, closeMenu, openMenu, setMenuOpen, storageRef, db }}>
      {children}
    </MainContext.Provider>
  )
}
