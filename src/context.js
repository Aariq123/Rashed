import { createContext, useEffect } from "react";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, ref } from 'firebase/storage'
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCart } from "react-use-cart";

export const MainContext = createContext()


export const ContextProvider = ({ children }) => {
  const matches = useMediaQuery('(min-width:460px)');
  const matches2 = useMediaQuery('(min-width:900px)');
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const { addItem, items, removeItem, cartTotal, setItems, updateItemQuantity } = useCart()

  const firebaseConfig = {

    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID


    /*
    apiKey: "AIzaSyA6OJkqXfQ8HGGUJqNxxbXBG1wJotmMCX8",
    authDomain: "rashed-gayy.firebaseapp.com",
    databaseURL: "https://rashed-gayy-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rashed-gayy",
    storageBucket: "rashed-gayy.appspot.com",
    messagingSenderId: "618008330965",
    appId: "1:618008330965:web:70e7cf2283b969fccad85c"
    */
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
      onSnapshot(doc(db, 'signedUsers', user.uid),
        (doc) => {
          setUserDetails(doc.data())
        },
        (err) => { console.log(err) }
      )
    }
  }, [user])




  const openMenu = () => {
    setMenuOpen(true)
  }


  const closeMenu = (hoho) => {
    if (menuOpen == true) {
      if (!hoho.target.className.includes('gay')) {
        setMenuOpen(false)
      }
    }
  }

  console.log(items)


 


  return (
    <MainContext.Provider value={{ user, setUser, setUserDetails, userDetails, app, addItem, setItems, removeItem, items, updateItemQuantity, cartTotal, matches, matches2, menuOpen, removeItem,  closeMenu, openMenu, setMenuOpen, storageRef, db }}>
      {children}
    </MainContext.Provider>
  )
}
