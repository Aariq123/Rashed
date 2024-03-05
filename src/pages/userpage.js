import { Avatar, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { MainContext } from "../context";
import { deepOrange } from '@mui/material/colors';
import { doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Link } from "react-router-dom";


const UserPage = () => {
    const { app, user, setUser, db, setUserDetails, userDetails, matches } = useContext(MainContext)
    const [logIn, setLogIn] = useState(true)
    const [signUpName, setSignUpName] = useState('')
    const [signUpEmail, setSignUpEmail] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [logInEmail, setlogInEmail] = useState('')
    const [logInPassword, setlogInPassword] = useState('')
    const [errorDiv, setErrorDiv] = useState([])

    const auth = getAuth(app);

    const signOutAuth = getAuth()



    const login = () => {
        if (logInEmail !== '' && logInPassword !== '') {
            signInWithEmailAndPassword(auth, logInEmail, logInPassword).then(res => {
                setUser(res.user)
                getDoc(doc(db, 'signed users', res.user.uid))
                    .then((res) => {
                        setUserDetails(res.data())
                    })
            }).catch((err)=>{
                console.log(err.code)
                setErrorDiv(['red-600', 'Password or email may be wrong!'])
            })
            setTimeout(() => setErrorDiv([]), 4000)
        }
    }


    const signUp = () => {
        if (signUpEmail !== '' && signUpPassword !== '' && setSignUpName !== '') {
            if(signUpPassword.length < 6){
                setErrorDiv(['red-600', 'Password has to be at least 6 characters long!'])
            }else{
                createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
                .then(res => {
                    console.log(res)
                    setUser(res.user)
                    setDoc(doc(db, 'signed users', res.user.uid), {
                        email: res.user.email,
                        favourites: [],
                        wishList: [],
                        orderHistory: []
                    })
                }).catch((err)=>{
                    if(err.message == 'Firebase: Error (auth/email-already-in-use).'){
                        setErrorDiv(['red-600', 'Email already in use!'])
                    }
                    console.log(err.message)
                })
            }
            
        }else{
            setErrorDiv(['red-600', 'Fill Out All The Information!'])
        }
        setTimeout(() => setErrorDiv([]), 4000)
    }


    const signout = () => {
        signOut(signOutAuth).then(hehe => {
            setUserDetails(null)
        }).catch(error => {
            console.log(error)
        });
    }

    const toggleLogin = () => {
        setLogIn(!logIn)
    }


    const removeFromFavourites = (product) => {
        console.log(userDetails.favourites)
        updateDoc(doc(db, 'signed users', user.uid),{
           favourites:arrayRemove(product)
        })
    }


    return (
        <div className="container m-auto">
            <div className="flex min-h-screen text-center flex-col items-center justify-center">
            <div className={errorDiv.length > 0 ? `z-20 font-bold text-${errorDiv[0]} text-lg p-8 transition-all duration-500 fixed top-1/3 right-0 bg-white rounded-md shadow-2xl` : 'text-white text-lg p-8 transition-all duration-500 fixed top-1/3 right-[-100%]'}>{errorDiv[1]}</div>
                {
                    user == null &&
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className={`px-1 sm:px-0 w-full sm:w-9/12 md:w-1/2 ${logIn ? 'block' : 'hidden'}`}>
                            <p className="text-lg font-bold mb-10">Login to your account:</p>
                            <form className="border-2 py-10 px-2 sm:p-10 flex flex-col">
                                <TextField value={logInEmail} onChange={(e) => setlogInEmail(e.target.value)} type="email" size="small" fullWidth placeholder="email"></TextField>
                                <TextField value={logInPassword} onChange={(e) => setlogInPassword(e.target.value)} type='password' size="small" fullWidth sx={{ marginY: 5 }} placeholder="password"></TextField>
                                <Button onClick={login} variant="contained">Log-in</Button>
                            </form>

                            <p className="mt-4">Don't have an account?<Button onClick={toggleLogin} color="primary">Sign Up</Button></p>
                        </div>
                        <div className={`px-1 sm:px-0 w-full sm:w-9/12 md:w-1/2 mt-4 ${logIn ? 'hidden' : 'block'}`}>
                            <p className="text-lg font-bold">Create an account:</p>
                            <p className="my-6">Get 10% off in your first order</p>
                            <form className="border-2 py-10 px-2 sm:p-10 flex flex-col">
                                <TextField value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} type="email" size="small" fullWidth placeholder="email"></TextField>
                                <TextField value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} type="password" size="small" fullWidth sx={{ marginY: 5 }} placeholder="password"></TextField>
                                <Button onClick={signUp} color="secondary" variant="contained">Sign up</Button>
                            </form>

                            <p className="mt-4">Already have an account?<Button onClick={toggleLogin} color="secondary">Log In</Button></p>
                        </div>
                    </div>
                }




                {
                    userDetails &&
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full mb-6 mt-32 flex flex-col items-center">
                            <Avatar sx={{ bgcolor: deepOrange[500], height: 50, width: 50 }}></Avatar>
                            <p className="text-sm sm:text-base font-bold my-6">{user && user.email}</p>
                            <Button sx={{height:matches ? 26 : 21, fontSize:matches? 13 :10}} onClick={signout} variant="contained" >Sign out</Button>
                        </div>
                        <div className="w-full flex flex-col items-center px-3 sm:p-0">
                            <p className="text-md sm:text-lg my-10 font-bold">Favourites:</p>
                            {userDetails.favourites.length > 0 &&
                                userDetails.favourites.map(product => {
                                    const { name, price } = product.data  
                                    return (
                                        <div key={product.id} className="flex w-full mb-6 sm:w-96 rounded-lg p-2 shadow-lg border-1 border-slate-300 items-center justify-between">
                                            <Link to='/productpage' state={{ data: product.data, id: product.id, category: 'watches' }}>
                                            <div className="text-left">
                                                <p className="text-xs sm:text-sm md:text-base font-bold">{name}</p>
                                                <p className="text-xs sm:text-sm md:text-base mt-2">৳{price}</p>
                                            </div>
                                            </Link>
                                            <Button onClick={() => removeFromFavourites(product)} sx={{height:matches ? 26 : 20, fontSize:matches? 13 :10}} variant="outlined" color="error">Remove</Button>
                                        </div>
                                    )  
                                })
                            }
                            {userDetails.favourites.length == 0 && <div className="text-red-600">No favourites!</div>}
                        </div>
                        <div className="w-full flex flex-col items-center px-3 sm:p-0">
                            <p className="text-md sm:text-lg my-10 font-bold">Wishlist:</p>
                            {userDetails.wishList.length > 0 &&
                                userDetails.wishList.map(product => {
                                    const { name, price } = product.data  
                                    return (
                                        <div key={product.key} className="flex w-full mb-6 sm:w-96 rounded-lg p-2 shadow-lg border-1 border-slate-300 items-center justify-between">
                                            <div className="text-left">
                                            <p className="text-xs sm:text-sm md:text-base font-bold">{name}</p>
                                                <p className="text-xs sm:text-sm md:text-base mt-2">৳{price}</p>
                                            </div>
                                            <Button sx={{height:26}} variant="outlined" color="error">Remove</Button>
                                        </div>
                                    )  
                                })
                            }
                            {userDetails.wishList.length == 0 && <div className="text-red-600">No items!</div>}
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}

export default UserPage;