
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StyleIcon from '@mui/icons-material/Style';
import { MainContext } from "../context";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useContext, useEffect, useState, useRef } from "react";
import { Button, Card, CardMedia } from "@mui/material";


const Home = () => {
    const { matches, addCartItem, matches2, db } = useContext(MainContext)
    const [products, setProducts] = useState([])
    const [images, setImages] = useState([])
    const storage = getStorage();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const slider = useRef(null)
    const [ count, setCount ] = useState(0)
    const pageRef = useRef(null)

    useEffect(() => {
        if (products.length < 1) {
            setLoading(true)
            getDocs(collection(db, 'discountedItems')).then(res => {
                res.forEach(item => {
                    item.data().hoho.forEach(product => {
                        getDoc(doc(db, product.path.split('/')[0], product.path.split('/')[1]))
                            .then(res => {
                                setLoading(false)
                                setError(false)
                                console.log(res)
                                setProducts((prev) => [...prev, { id: res.id, data: res.data(), category: product.path.split('/')[0] }])
                            }).catch(()=>setError(true))
                    })
                })
            })
        }
    }, [])

    console.log(products)
    useEffect(() => {
        if (products.length > 0) {
            if (images.length < 1) {
                products.forEach(item => {
                    getDownloadURL(ref(storage, `${item.category}/${item.id}/images/home.jpg`)).then(res => {
                        setImages((prev) => [...prev, {
                            id: item.id,
                            res
                        }])
                    })
                })
            }
        }
    }, [products])





   const slide = () => {
        if(slider.current && pageRef.current){
            let width 
            if(pageRef.current.offsetWidth > 900){
                width = 232
            }else if(pageRef.current.offsetWidth < 900 && pageRef.current.offsetWidth > 640){
                width = 172
            }else{
                width = 166
            }


            slider.current.style.transition = 'all ease.3s'
            slider.current.style.transform = `translateX(-${count*width}px)`
            setCount(count+1)
            if((products.length*width - width*count) <= slider.current.offsetWidth){
                setCount(0)
            }
        }
    }

    if(products.length > 0 && images.length > 0){
        setTimeout(()=>slide(),2500)
    }
    
    

    return (
        <div ref={pageRef}>
            <div className="container m-auto">
                <div className="m-auto sm:p-0 md:px-8 w-full mt-24 text-center flex flex-wrap justify-center overflow-x-hidden">
                    <div className="md:w-5/12 lg:w-4/12 m-2 sm:m-8 md:m-6">
                        <Link to='/watches'>
                            <img className="rounded-xl" src={require('../resources/menswatch.jpg')}></img>
                            <p className="text-base sm:text-lg md:text-xl ">MEN'S WATCH</p>
                        </Link>
                    </div>
                    <div className="md:w-5/12 lg:w-4/12 m-2 sm:m-8 md:m-6">
                        <Link to='/watches'>
                            <img className="rounded-xl" src={require('../resources/womenswatch.jpg')}></img>
                            <p className="text-base sm:text-lg md:text-xl ">WOMEN'S WATCH</p>
                        </Link>
                    </div>
                    <div className="md:w-5/12 lg:w-4/12 m-2 sm:m-8 md:m-6">
                        <Link to='/glasses'>
                            <img className=" rounded-xl" src={require('../resources/glass.jpg')}></img>
                            <p className="text-base sm:text-lg md:text-xl ">GLASS</p>
                        </Link>

                    </div>
                </div>
            </div>


            <div className="my-16 m-auto mx-6 sm:mx-12 md:mx-24 lg:mx-36">
                <p className='text-lg sm:text-2xl mb-8'>New Arrivals:</p>
                <div className='overflow-x-hidden '>
                    <div ref={slider} className="flex">
                        {loading && <p className="text-2xl mt-10">Loading.....</p>}
                        {error && <p className="text-xl mt-16">Sorry, an unknown error occured!</p>}
                        {
                            products.map((product, i) => {
                                const { name, price, stock } = product.data

                                let img = images.filter(image => image.id == product.id)

                                return (
                                    <div className="mr-2 sm:mr-4 my-2" key={product.id}>

                                        <Card sx={{ width: matches2 ? 220 : 160, minHeight: matches2 ? 400 : 300, position: 'relative' }}>
                                            {stock < 1 && <div className="text-red-600 z-10 bg-white absolute top-2 left-2 px-4 sm:text-lg">SOLD OUT</div>}
                                            <Link to='/productpage' state={{ data: product.data, id: product.id, category: product.category }}>
                                                <CardMedia sx={{ height: matches2 ? 270 : 180, overflow: 'hidden' }} >
                                                    <img src={img.length > 0 ? img[0].res : ''} alt="Couldn't fetch"></img>
                                                </CardMedia>
                                            </Link>
                                            <div className="p-2 pb-4 pt-0">
                                                <Link to='/productpage' state={{ data: product.data, id: product.id, category: product.category }}>
                                                    <p className="text-xs  md:text-base font-bold">{name}</p>
                                                    <p className="text-xs text-red-500 md:text-base my-2">৳{price}</p>

                                                </Link>
                                                <Button sx={{
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    fontSize: matches2 ? 14 : 10, paddingX: 1,
                                                    height: matches ? 24 : 20
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
            </div>

            <div className="flex flex-col sm:flex-row justify-evenly text-center bg-gray-200 py-10 my-6">
                <div>
                    <LocalShippingIcon fontSize={matches ? 'large' : 'small'}></LocalShippingIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Fast Delivery</p>
                    <p className="text-xs sm:text-sm md:text-base">We deliver both inside and outside of Dhaka.</p>
                </div>
                <div>
                    <StyleIcon fontSize={matches ? 'large' : 'small'}></StyleIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Lots Of Variety</p>
                    <p className="text-xs sm:text-sm md:text-base">Rich collection of various brands.</p>
                </div>
                <div>
                    <ThumbUpIcon fontSize={matches ? 'large' : 'small'}></ThumbUpIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Affordable</p>
                    <p className="text-xs sm:text-sm md:text-base">We offer a wide range of prices.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;