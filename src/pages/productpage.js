import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import { getDownloadURL, listAll, getStorage, ref } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from "@mui/material/TextField";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DefaultButton from "./button";

const Productpage = () => {
  const { addCartItem, matches, userDetails, user, db } = useContext(MainContext)
  const location = useLocation()
  const { data, id, category } = location.state
  const storage = getStorage();
  const [videoList, setVideoList] = useState([])
  const [imageList, setImageList] = useState([])
  const [image, setImage] = useState('')
  const [amount, setAmount] = useState(1)
  const [displayImage, setDisplayImage] = useState('')
  const [fullscreen, setFullscreen] = useState('')
  const [leftEye, setLeftEye] = useState('')
  const [rightEye, setRightEye] = useState('')
  const [errorDiv, setErrorDiv] = useState([])
  const [favourite, setFavourite] = useState(false)
  const [wishList, setWishList] = useState(false)


  useEffect(() => {
    if (imageList.length < 1) {
      const images = ref(storage, `${category}/${id}/images`)
      listAll(images).then(res => {
        res.items.forEach(image => {
        getDownloadURL(image).then(res => {
          setImageList((prev) => [...prev, res])
        })
      })}).catch(err=> console.log(err))

      const videos = ref(storage, `${category}/${id}/videos`)
      listAll(videos).then(res => res.items.forEach(image => {
        getDownloadURL(image).then(res => {
          setVideoList((prev) => [...prev, res])
        })
      }))
    }
    setDisplayImage(imageList[0])
  }, [])


  const toggleAmount = (sym) => {
    if (sym == 'plus') {
      if (amount < data.stock) {
        setAmount(amount + 1)
      }
    } else if (sym == 'minus') {
      if (amount > 1) {
        setAmount(amount - 1)
      }
    }
  }

  const fullscreenOn = (src) => {
    setFullscreen(src)
  }

  const fullscreenOff = (src) => {
    if (fullscreen !== '') {
      if (!src.className.includes('screenImg')) {
        setFullscreen('')
      }
    }
  }


  const addTofavourite = () => {
    updateDoc(doc(db, 'signedUsers', user.uid), {
      favourites: arrayUnion({ id: id, data: data, category: category })
    })

  }


  const addTowWishList = () => {
    updateDoc(doc(db, 'signedUsers', user.uid), {
      wishList: arrayUnion({ id: id, data: data, category: category })
    })
  }



  const stockOrNot = () => {
    if (data.stock > 0) {
      if (category == 'glasses') {
        addCartItem({ id: id, data: data, image: imageList[0], category, quantity: amount, leftEye, rightEye })
      } else {
        addCartItem({ id: id, data: data, image: imageList[0], category, quantity: amount })
      }
    }
  }


  useEffect(() => {
    if (userDetails) {
      if (userDetails.favourites.find(item => (item.category == category, item.id == id)) !== undefined) {
        setFavourite(true)
      } else {
        setFavourite(false)
      }

      if (userDetails.wishList.find(item => (item.category == category, item.id == id)) !== undefined) {
        setWishList(true)
      } else {
        setWishList(false)
      }
    }
  }, [userDetails, userDetails])

  
  return (
    <div onClick={(e) => fullscreenOff(e.target)}>
      {<div className={`absolute top-0 flex flex-col justify-center items-center left-0 overflow-hidden z-40 w-screen h-screen ${fullscreen == '' ? 'hidden' : ''}`}>
        <div className={errorDiv.length > 0 ? `z-20 font-bold text-${errorDiv[0]} text-lg p-8 transition-all duration-500 fixed top-1/3 right-0 bg-white rounded-md shadow-2xl` : 'text-white text-lg p-8 transition-all duration-500 fixed top-1/3 right-[-100%]'}>{errorDiv[1]}</div>
        <div className="cursor-pointer absolute top-6 text-2xl right-6 flex flex-col justify-center items-center z-40 text-white bg-red-600 h-8 w-8 rounded-full">x</div>
        <img className="screenImg z-30 sm:h-full" src={fullscreen} alt="" /></div>}
      <div className={`container m-auto ${fullscreen == '' ? '' : 'z-40 blur-md'}`}>
        {imageList &&
          <div>
            <div className="flex flex-col sm:flex-row justify-center mt-24">
              <div className="sm:mr-8 w-full sm:w-2/4">
                <img src={displayImage ? displayImage : imageList[0]} onClick={(e) => fullscreenOn(e.target.src)} className="h-72 sm:h-80 md:h-96 m-auto rounded-xl" alt="" />
                <div className="flex justify-center mt-4 m-auto max-w-44 sm:max-w-80 overflow-x-scroll ">
                  {imageList &&
                    imageList.map(image => {
                      return (
                        <img onClick={() => setDisplayImage(image)} className="hover:cursor-pointer h-12 w-10 sm:h-24 sm:w-20 mx-1 sm:mx-2 rounded-md border-black border-2" src={image}></img>
                      )
                    })
                  }
                </div>
              </div>
              <div className="mx-3 my-8 sm:m-0 sm:mt-6 w-full sm:w-2/4">
                <p className="text-base sm:text-lg md:text-xl font-bold">{data.name}</p>
                <p className="text-xs sm:text-sm md:text-basefont-bold my-2">৳{data.price}</p>
                <p className="text-xs sm:text-sm md:text-base text-wrap my-2">{data.description}</p>
                {data.stock > 0 ? <p className="text-sm sm:text-base text-green-600">In stock({data.stock})</p> : <p className="text-sm sm:text-base text-red-600">Stock out</p>}
                <div className="flex flex-col">
                  <div className="flex mt-2 items-center">
                    <div className="flex items-center inline-block border-2 border-black mr-2">
                      <IconButton sx={{ height: matches ? 14 : 5, paddingX: 1, paddingY: matches? 1: 0}} onClick={() => toggleAmount('minus')}><RemoveIcon></RemoveIcon></IconButton>
                      <div className="text-xl px-2">{amount}</div>
                      <IconButton sx={{ fontSize: matches ? 14 : 10, paddingX: 1, paddingY:matches ? 1 : 0 }} onClick={() => toggleAmount('plus')}><AddIcon></AddIcon></IconButton>
                    </div>
                    <DefaultButton onClick={stockOrNot} text='Add to cart'></DefaultButton>
                  </div>
                  {userDetails &&
                    <div className="mt-4 flex">
                      <div className={favourite ? 'hidden' : 'block hover:cursor-pointer'}>
                        <FavoriteBorderIcon onClick={addTofavourite} fontSize={matches ? "large" : 'medium'}></FavoriteBorderIcon>
                      </div>
                      <div className={!favourite ? 'hidden' : 'block hover:cursor-pointer'}>
                        <FavoriteIcon color="error" onClick={addTofavourite} fontSize={matches ? "large" : 'medium'}></FavoriteIcon>
                      </div>
                      <div className={wishList ? 'hidden' : 'block hover:cursor-pointer'}>
                        <BookmarkBorderIcon onClick={addTowWishList} sx={{ marginLeft: 2 }} fontSize={matches ? "large" : 'medium'}></BookmarkBorderIcon>
                      </div>
                      <div className={wishList ? "block hover:cursor-pointer" : 'hidden'}>
                        <BookmarkIcon onClick={addTowWishList} sx={{ marginLeft: 2 }} fontSize={matches ? "large" : 'medium'}></BookmarkIcon>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-2xl my-4 mx-3">Videos:</p>
              <div className="overflow-x-scroll flex justify-center max-w-96">
                {videoList &&
                  videoList.map(vid => {
                    return (
                      <video className="h-60 sm:h-72" controls>
                        <source src={vid}></source>
                      </video>
                    )
                  })
                }
              </div>
              <div>
                {category == 'glasses' &&
                  <div className="my-6 mt-16">
                    <p className="text-lg font-bold my-4">*If you have any eyesight requirements. Please write it here:</p>
                    <div className="flex justify-evenly">
                      <div className="flex items-center my-2">
                        <p className="mr-2">Left Eye:</p>
                        <TextField onChange={(e) => setLeftEye(e.target.value)} size="small" id="standard-basic" label="ex:-2.0" variant="outlined" />
                      </div>
                      <div className="flex items-center">
                        <p className="mr-2">Right Eye:</p>
                        <TextField onChange={(e) => setRightEye(e.target.value)} size="small" id="standard-basic" label="ex:-2.5" variant="outlined" />
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Productpage;