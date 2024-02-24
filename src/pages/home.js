import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StyleIcon from '@mui/icons-material/Style';
import { useContext } from "react";
import { MainContext } from "../context";


const Home = () => {
    const { matches } = useContext(MainContext)

    return (
        <div>
            <div className="container m-auto">
                <div className="h-screen flex justify-start sm:justify-center items-center overflow-x-hidden">
                    <div className="ml-2 sm:mr-6">
                        <h1 className="text-lg sm:text-2xl mb-4">Looking for unique watches?</h1>
                        <Link to='/watches'><Button sx={{fontSize:matches?14:10,paddingX:1}} variant="contained">See all watches</Button></Link>
                    </div>
                    <div className="relative hero-container m-0 sm:ml-6">
                        <img className="hero-img watches one absolute" src={require('../resources/2.jpg')} alt="" />
                        <img className="hero-img watches two absolute" src={require('../resources/New folder/home.jpg')} alt="" />
                        <img className="hero-img watches three absolute" src={require('../resources/3.jpg')} alt="" />
                    </div>
                </div>
                <div className="h-screen flex justify-center items-center">
                    <div className="relative hero-container ml-6">
                        <img className="hero-img glasses one absolute" src={require('../resources/glass 1/1.jpg')} alt="" />
                        <img className="hero-img glasses two absolute" src={require('../resources/glass 1/2.jpg')} alt="" />
                        <img className="hero-img glasses three absolute" src={require('../resources/glass 1/3.jpg')} alt="" />
                    </div>
                    <div className="mr-6 z-10">
                        <h1 className="text-lg sm:text-2xl mb-4">Looking for unique glasses?</h1>
                        <Link to='/glasses'><Button sx={{fontSize:matches?14:10,paddingX:1}} variant="contained">See all glasses</Button></Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-evenly text-center bg-gray-200 py-10 my-6">
                <div>
                    <LocalShippingIcon sx={{fontSize:60}}></LocalShippingIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Fast Delivery</p>
                    <p className="text-sm sm:text-base">We deliver both inside and outside of Dhaka.</p>
                </div>
                <div>
                    <StyleIcon sx={{fontSize:60}}></StyleIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Lots Of Variety</p>
                    <p className="text-sm sm:text-base">Rich collection of various brands.</p>
                </div>
                <div>
                    <ThumbUpIcon sx={{fontSize:60}}></ThumbUpIcon>
                    <p className="my-4 font-bold text-base sm:text-lg">Affordable</p>
                    <p className="text-sm sm:text-base">We offer a wide range of prices.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;