import TextField from "@mui/material/TextField";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context";
import { Button, Card, CardMedia } from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore"; 

const Cart = () => {
    const { cartItem, removeItem, db, setCartItem } = useContext(MainContext)
    const [ total, setTotal ] = useState(0)
    const [ name, setName ] = useState('')
    const [ contact, setContact ] = useState('')
    const [ address, setAddress ] = useState('')


  


    useEffect(()=>{
        if(cartItem.length > 0){
            let hehe = cartItem.reduce((acc, cur)=>acc+(cur.data.price*cur.quantity), 0)
            setTotal(hehe)
        }
    }, [cartItem])

  
    const send = () => {
        let hehe = cartItem.map(element => ({name:element.data.name, price:element.data.price, quantity:element.quantity}));
        setDoc(doc(db, "customer orders", name), {
            name: name,
            contact:contact,
            address:address,
            payout:total,
            products:hehe
        }).then(()=>{
            setName('')
            setContact('')
            setAddress('')
            cartItem.forEach(item=>{
                updateDoc(doc(db, item.category, item.id),{
                    stock:item.data.stock - item.quantity
                })
            })
        }).then(()=>setCartItem([]))
    }

   

    return (
        <div>
            <div className="container m-auto mt-20 text-center flex flex-col items-center">
                <div className="w-full sm:w-2/4">
                    <p className="text-2xl my-6">Your Cart:</p>
                    <div className="px-6 sm:p-0">
                        {cartItem.length == 0 && <p className="text-xl text-red-600 my-10">No items in your cart!</p>}
                        {cartItem.length > 0 &&
                            <div>
                                {cartItem.map((item, i) => {
                                    const { name, price } = item.data
                                    return (
                                        <div className="mb-4">
                                        <Card sx={{ display: 'flex',alignItems:'center', justifyContent:'space-between', dropShadow: '7px 7px 4px rgba(0, 0, 0, 0.18)' }}>
                                            <div className="flex">
                                                <CardMedia>
                                                    <img className="h-28" src={item.image && item.image} alt="" />
                                                </CardMedia>
                                                <div className="ml-2 text-left">
                                                    <p className="text-lg font-bold">{name}</p>
                                                    <p className="my-2">৳{price}</p>
                                                    <p>Quantity: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <Button onClick={()=>removeItem(i)} variant="outlined" color="error">Remove</Button>
                                        </Card>
                                        </div>
                                    )
                                })}
                                <div className="mt-6 border-t-2 border-black flex pt-2 justify-evenly">
                                    <p className="text-lg font-bold">Total:</p>
                                    <p className="text-lg">৳{total}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="my-10 w-full md:w-2/4 px-2 md:px-0">
                    <p className="text-2xl my-6">Additional info:</p>
                    <form className="rounded-2xl py-10 px-1 mb-10 sm:px-6 shadow-2xl">
                        <div className="flex flex-col items-start">
                            <label>Name:</label>
                            <TextField onChange={(e)=>setName(e.target.value)} value={name} fullWidth id="outlined-basic" label="your name" variant="outlined" />
                        </div>
                        <div className="flex flex-col my-6 items-start ">
                            <label>Phone number:</label>
                            <TextField onChange={(e)=>setContact(e.target.value)} value={contact} fullWidth  id="outlined-basic" label="ex:015xxxxxxxx" variant="outlined" />
                        </div> 
                        <div className="flex flex-col items-start ">
                            <label>Address:</label>
                            <TextField onChange={(e)=>setAddress(e.target.value)} value={address} fullWidth id="outlined-basic" label="ex:525, Shahjahanpur, Dhaka" variant="outlined" />
                        </div>
                    </form>
                    <Button onClick={send} variant="contained">Place order</Button>
                </div>
                <div className="my-6">
                    <p className="text-lg">*Payment method:</p>
                    <p className="text-red-600 mt-2">Cash on delivery</p>
                </div>
            </div>
        </div>
    );
}

export default Cart;