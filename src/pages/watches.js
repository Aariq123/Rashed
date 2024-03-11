import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context";
import { getDownloadURL, listAll, getStorage, ref } from "firebase/storage";
import { Button, Card, CardMedia } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const Watches = () => {
    const { db, addCartItem, matches2, matches } = useContext(MainContext)
    const [images, setImages] = useState([])
    const [products, setProducts] = useState([])
    const storage = getStorage();
    const [loading, setLoading] = useState(false)
    const [priceShort, setPriceShort] = useState('Low to high')
   

    useEffect(() => {
        if (products.length < 1) {
            setLoading(true)
            const querySnapshot = getDocs(collection(db, "watches"));
            querySnapshot.then(docs => {
                docs.forEach(doc => {
                    setProducts((prev) => [...prev, { id: doc.id, data: doc.data() }])
                })
            }).then(() => setLoading(false))
        }
    }, [])




    useEffect(() => {
        if (products.length > 0) {
            if (images.length < 1) {
                products.forEach(item => {
                    getDownloadURL(ref(storage, `watches/${item.id}/images/home.jpg`)).then(res => {
                        setImages((prev) => [...prev, {
                            id: item.id,
                            res
                        }])
                    })
                })
            }
        }
    }, [products])


    const handleChange = (e) => {
        setPriceShort(e.target.value)
        if (priceShort == 'Low to high') {
            products.sort((a, b) => b.data.price - a.data.price)
        } else {
            products.sort((a, b) => a.data.price - b.data.price)
        }
    }

   


    return (
        <div className="m-auto container min-h-screen">
                           
            <p className="text-lg sm:text-2xl mt-24 text-center">All watches:</p>
            {products &&
                <div className="my-6">
                    <div className="flex ml-2 sm:m-0 flex-col items-start sm:flex-row sm:items-center">
                        <p className="text-sm sm:text-base font-bold mr-1">SHORT BY(price):</p>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={priceShort}
                            onChange={handleChange}
                            sx={{
                                borderRadius: 0,
                                height: matches2 ? 30 : 25,
                                width: matches2 ? 120 : 100,
                                fontSize: matches2 ? 14 : 12
                            }}
                        >
                            <MenuItem value={'Low to high'}>Low to high</MenuItem>
                            <MenuItem value={'High to low'}>High to low</MenuItem>
                        </Select>
                    </div>
                </div>}
            <div className="flex flex-wrap  mt-12 justify-center">
                {loading && <p className="text-2xl mt-10">Loading.....</p>}
                {
                    products.map((product, i) => {
                        const { name, price, stock } = product.data

                        let img = images.filter(image => image.id == product.id)

                        return (
                            <div className="sm:mx-4 my-8" key={product.id}>

                                <Card sx={{ width: matches2 ? 220 : 160, minHeight: matches2 ? 400 : 300, position: 'relative' }}>
                                    {stock < 1 && <div className="text-red-600 z-10 bg-white absolute top-2 left-2 px-4 sm:text-lg">SOLD OUT</div>}
                                    <Link to='/productpage' state={{ data: product.data, id: product.id, category: 'watches' }}>
                                        <CardMedia sx={{ height: matches2 ? 270 : 180, overflow: 'hidden' }} >
                                            <img src={img.length > 0 ? img[0].res : ''} alt="Couldn't fetch"></img>
                                        </CardMedia>
                                    </Link>
                                    <div className="p-2 pb-4 pt-0">
                                        <Link to='/productpage' state={{ data: product.data, id: product.id, category: 'watches' }}>
                                            <p className="text-xs sm:text-sm md:text-base font-bold">{name}</p>
                                            <p className="text-xs sm:text-sm md:text-base my-2">৳{price}</p>

                                        </Link>
                                        <Button sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            fontSize: matches2 ? 14 : 10, paddingX: 1,
                                            height:matches ? 24 : 20
                                        }}
                                            onClick={() => addCartItem({ id: product.id, data: product.data, image: img.length > 0 && img[0].res, quantity: 1, category: 'watches' })}
                                            variant="contained">
                                            Add to cart
                                        </Button>
                                    </div>
                                </Card>

                            </div>
                        )
                    })

                }
            </div>
        </div>
    );
}

export default Watches;

