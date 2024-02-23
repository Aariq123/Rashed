import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context";
import { getDownloadURL, listAll, getStorage, ref } from "firebase/storage";
import { Button, Card, CardMedia } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const Glasses = () => {
    const { db, addCartItem, matches2 } = useContext(MainContext)
    const [images, setImages] = useState([])
    const [products, setProducts] = useState([])
    const storage = getStorage();
    const [loading, setLoading] = useState(false)
    const [priceShort, setPriceShort] = useState('Low to high')

    useEffect(() => {
        if (products.length < 1) {
            setLoading(true)
            const querySnapshot = getDocs(collection(db, "glasses"));
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
                    console.log(item)
                    getDownloadURL(ref(storage, `glasses/${parseInt(item.id)}/images/home.jpg`)).then(res => {
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
        if(priceShort == 'Low to high'){
            products.sort((a,b)=>b.data.price-a.data.price)
        }else{
            products.sort((a,b)=>a.data.price-b.data.price)
        }
    }

    console.log(images)
    console.log(products)

    return (
        <div className="m-auto container min-h-screen">
            <p className="text-lg sm:text-2xl mt-24 text-center">All watches:</p>
            {products &&
                <div className="my-6">
                    <div className="flex flex-col sm:flex-row items-start">
                        <p className="text-sm sm:text-base font-bold mr-1">SHORT BY(price):</p>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={priceShort}
                            onChange={handleChange}
                            sx={{height:30, borderRadius:0}}
                        >
                            <MenuItem value={'Low to high'}>Low to high</MenuItem>
                            <MenuItem value={'High to low'}>High to low</MenuItem>
                        </Select>
                    </div>
                </div>}
            <div className="flex mx-20 mt-12 justify-center">
                {loading && <p className="text-2xl mt-10">Loading.....</p>}
                {
                    products.map((product, i) => {
                        const { description, name, price, stock } = product.data

                        let img = images.filter(image => image.id == product.id)

                        return (
                            <div className="mx-4 my-6" key={product.id}>

                                <Card sx={{ width: matches2 ? 230 : 180, height: matches2 ? 400 : 300, position: 'relative', dropShadow: '5px 5px 3px rgba(0, 0, 0, 0.10)' }}>
                                {stock < 1 && <div className="text-red-600 z-10 bg-white absolute top-2 left-2 px-4 text-lg">SOLD OUT</div>}
                                    <Link to='/productpage' state={{ data: product.data, id: product.id, category:'glasses' }}>
                                        <CardMedia sx={{ height: matches2 ? 270 : 200, overflow: 'hidden'  }} >
                                            <img src={img.length > 0 && img[0].res}></img>
                                        </CardMedia>
                                    </Link>
                                    <div className="p-2 pb-4 pt-0">
                                        <Link to='/productpage' state={{ data: product.data, id: product.id, category:'glasses' }}>
                                            <p className="text-lg font-bold">{name}</p>
                                            <p className="my-2">৳{price}</p>
                                           
                                        </Link>
                                        <Button sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            fontSize: matches2 ? 14 : 10, paddingX: 1
                                        }} onClick={() => addCartItem({ id: product.id, data: product.data, image: img.length > 0 && img[0].res, quantity: 1, category:'glasses' })} variant="contained">Add to cart</Button>
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

export default Glasses;