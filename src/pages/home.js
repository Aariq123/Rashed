import { Button } from "@mui/material";
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StyleIcon from '@mui/icons-material/Style';
import { useContext } from "react";
import { MainContext } from "../context";
import DefaultButton from "./button";

const Home = () => {
    const { matches } = useContext(MainContext)

    return (
        <div>
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