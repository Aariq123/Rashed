import { useContext } from "react";
import { MainContext } from "../context";
import { Button } from "@mui/material";

const DefaultButton = ({text}) => {
    const { matches, matches2 } = useContext(MainContext)


    return ( 
        <Button sx={{
            backgroundColor: 'black',
            color: 'white',
            fontSize: matches2 ? 14 : 10, 
            paddingX: 1,
            height:matches ? 30 : 26,
            ":hover":{
                backgroundColor: 'black',
                color: 'white',
                scale:'1.01'
            }
        }}>
           {text}
        </Button>
     );
}
 
export default DefaultButton;