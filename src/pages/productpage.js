import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context";
import { useLocation } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import { getDownloadURL, listAll, getStorage, ref } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from "@mui/material/TextField";


const Productpage = () => {
  const { storageRef, addCartItem } = useContext(MainContext)
  const location = useLocation()
  const storage = getStorage();
  const [imageList, setImageList] = useState([])
  const [videoList, setVideoList] = useState([])
  const [amount, setAmount] = useState(1)
  const [displayImage, setDisplayImage] = useState('')
  const [fullscreen, setFullscreen] = useState('')
  const { data, id, category } = location.state
  const [ leftEye, setLeftEye ] = useState('')
  const [ rightEye, setRightEye ] = useState('')


  useEffect(() => {
    if (imageList.length < 1) {
      const images = ref(storage, `${category}/${id}/images`)
      listAll(images).then(res => res.items.forEach(image => {
        getDownloadURL(image).then(res => {
          setImageList((prev) => [...prev, res])
        })
      }))

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

  console.log(amount)
  return (
    <div onClick={(e) => fullscreenOff(e.target)}>
      {<div className={`absolute top-0 flex flex-col justify-center items-center left-0 overflow-hidden z-20 w-screen h-screen ${fullscreen == '' ? 'hidden' : ''}`}>
        <div className="cursor-pointer absolute top-6 text-2xl right-6 flex flex-col justify-center items-center z-40 text-white bg-red-600 h-8 w-8 rounded-full">x</div>
        <img className="screenImg z-30 sm:h-full" src={fullscreen} alt="" /></div>}
      <div className={`container m-auto ${fullscreen == '' ? '' : 'blur-md'}`}>
        {imageList &&
          <div>
            <div className="flex justify-center mt-36">
              <div>
                <img src={displayImage ? displayImage : imageList[0]} onClick={(e) => fullscreenOn(e.target.src)} className="h-96 w-80 rounded-xl" alt="" />
                <div className="flex overflow-x-scroll m-6">
                  {imageList &&
                    imageList.map(image => {
                      return (
                        <img onClick={() => setDisplayImage(image)} className="hover:cursor-pointer h-24 w-20 mx-2 rounded-md border-black border-2" src={image}></img>
                      )
                    })
                  }
                </div>
              </div>
              <div className="ml-6 mt-6">
                <p className="text-2xl font-bold">{data.name}</p>
                <p className="font-bold my-2">৳{data.price}</p>
                <p className="my-2">{data.description}</p>
                {data.stock > 0 ? <p className="text-green-600">In stock({data.stock})</p> : <p className="text-red-600">Stock out</p>}
                <div className="flex mt-2">
                  <div className="flex items-center inline-block border-2 border-black mr-2">
                    <IconButton onClick={() => toggleAmount('minus')} sx={{ borderRight: '1px solid black', borderRadius: 0 }}><RemoveIcon></RemoveIcon></IconButton>
                    <div className="text-xl px-2">{amount}</div>
                    <IconButton onClick={() => toggleAmount('plus')} sx={{ borderLeft: '1px solid black', borderRadius: 0 }}><AddIcon></AddIcon></IconButton>
                  </div>
                  <Button onClick={() => addCartItem({ id: id, data: data, image: imageList[0], quantity: amount, leftEye, rightEye })} variant="contained">Add to cart</Button>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-2xl my-4">Videos:</p>
              <div className="overflow-x-scroll flex justify-center max-w-96">
                {videoList &&
                  videoList.map(vid => {
                    return (
                      <video className="h-72" controls>
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
                        <TextField onChange={(e)=>setLeftEye(e.target.value)} size="small" id="standard-basic" label="ex:-2.0" variant="outlined" />
                      </div>
                      <div className="flex items-center">
                        <p className="mr-2">Right Eye:</p>
                        <TextField onChange={(e)=>setRightEye(e.target.value)} size="small" id="standard-basic" label="ex:-2.5" variant="outlined" />
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