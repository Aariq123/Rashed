import TextField from "@mui/material/TextField";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "../context";
import { Button, Card, CardMedia, IconButton } from "@mui/material";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const Cart = () => {
    const { removeItem, db, matches, matches2, user, items, cartTotal, setItems, updateItemQuantity } = useContext(MainContext)
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [address, setAddress] = useState('')
    const [errorDiv, setErrorDiv] = useState([])

    /*
        useEffect(() => {
            setItems([])
        }, [])
    
    */
    const send = () => {
        if ((name !== '' && contact !== '' && address !== '') && items.length > 0) {
            let hehe = items.map(element => ({ name: element.name, price: element.price, quantity: element.quantity }));
            setDoc(doc(db, "customerOrders", name), {
                name: name,
                contact: contact,
                address: address,
                payout: cartTotal,
                products: hehe
            }).then(() => {
                setName('')
                setContact('')
                setAddress('')
                console.log(items)
                items.forEach(item => {
                    updateDoc(doc(db, item.category, item.id), {
                        stock: item.stock - item.quantity
                    })
                })
            }).then(() => {
                setItems([])
            })

            if (user) {
                hehe.forEach(product => {
                    updateDoc(doc(db, 'signedUsers', user.uid), {
                        orderHistory: arrayUnion(product)
                    })
                })
            }
            setErrorDiv(['green-600', 'Your Order Has Been Placed'])
        } else if (items.length === 0) {
            setErrorDiv(['red-600', 'Your Cart Is Empty!'])
        } else if (name === '' || contact === '' || address === '') {
            setErrorDiv(['red-600', 'Fill Out All The Information!'])
        }
        setTimeout(() => setErrorDiv([]), 5000)
    }




    return (
        <div>
            <div className="container m-auto mt-20 text-center flex flex-col items-center relative">
                <div className={errorDiv.length > 0 ? `z-20 font-bold text-${errorDiv[0]} text-lg p-8 transition-all duration-500 fixed top-1/3 right-0 bg-white rounded-md shadow-2xl` : 'text-white text-lg p-8 transition-all duration-500 fixed top-1/3 right-[-100%]'}>{errorDiv[1]}</div>
                <div className="w-full md:w-9/12 lg:w-1/2">
                    <p className="text-lg sm:text-2xl my-6">Your Cart:</p>
                    <div className="px-6 sm:p-0">
                        {items.length == 0 && <p className="text-base sm:text-xl text-red-600 my-10">No items in your cart!</p>}
                        {items.length > 0 &&
                            <div>
                                {
                                    items.map((item, i) => {
                                        return (
                                            <div className="mb-4" key={i}>
                                                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', dropShadow: '7px 7px 4px rgba(0, 0, 0, 0.18)' }}>
                                                    <div className="flex">
                                                        <CardMedia>
                                                            <img className="h-28" src={item.image && item.image} alt="" />
                                                        </CardMedia>
                                                        <div className="ml-2 text-left">
                                                            <p className="text-sm sm:text-lg font-bold">{item.name}</p>
                                                            <p className="text-xs sm:text-base my-2">৳{item.price}</p>
                                                            <p className="sm:text-base inline flex items-center">
                                                                <p onClick={()=>updateItemQuantity(item.id, item.quantity-1)} className="shadow-md"><RemoveIcon color="error"></RemoveIcon></p>
                                                                 <p className="px-2 shadow-md">{item.quantity < item.stock ? item.quantity : item.stock}</p>
                                                                <p onClick={()=>updateItemQuantity(item.id, item.quantity < item.stock ? item.quantity+1 : item.stock)} className="shadow-md"><AddIcon color="success"></AddIcon></p>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button onClick={() => removeItem(item.id)} variant="outlined" color="error">Remove</Button>
                                                </Card>
                                            </div>
                                        )
                                    })
                                }
                                <div className="mt-6 border-t-2 border-black flex pt-2 justify-evenly">
                                    <p className="text-lg font-bold">Total:</p>
                                    <p className="text-lg">৳{cartTotal}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="my-10 w-full md:w-2/4 px-2 md:px-0">
                    <p className="text-base sm:text-2xl my-6">Additional info:</p>
                    <form className="text-sm sm:text-base rounded-2xl py-10 px-1 mb-10 sm:px-6 shadow-2xl">
                        <div className="flex flex-col items-start">
                            <label>Name:</label>
                            <TextField type="text" required size={matches ? 'normal' : 'small'} onChange={(e) => setName(e.target.value)} value={name} fullWidth id="outlined-basic" label="your name" variant="outlined" />
                        </div>
                        <div className="flex flex-col my-6 items-start ">
                            <label>Phone number:</label>
                            <TextField value={contact} required size={matches ? 'normal' : 'small'} onChange={(e) => {
                                if (/^\d+$/.test(e.target.value)) {
                                    setContact(e.target.value)
                                }
                            }} fullWidth id="outlined-basic" label="ex:015xxxxxxxx" variant="outlined" />
                        </div>
                        <div className="flex flex-col items-start ">
                            <label>Address:</label>
                            <TextField required size={matches ? 'normal' : 'small'} onChange={(e) => setAddress(e.target.value)} value={address} fullWidth id="outlined-basic" label="ex:525, Shahjahanpur, Dhaka" variant="outlined" />
                        </div>
                    </form>
                    <Button sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        fontSize: matches2 ? 14 : 10,
                        paddingX: 1,
                        height: matches ? 30 : 26,
                        ":hover": {
                            backgroundColor: 'black',
                            color: 'white',
                            scale: '1.01'
                        }
                    }}
                        onClick={send}
                    >
                        Place order
                    </Button>

                </div>
                <div className="my-6">
                    <p className="text-base sm:text-lg">*Payment method:</p>
                    <p className="text-xs sm:text-base text-red-600 mt-2">Cash on delivery</p>
                </div>
            </div>
        </div>
    );
}

export default Cart;