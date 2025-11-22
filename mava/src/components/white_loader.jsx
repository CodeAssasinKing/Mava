import React, {useEffect, useState} from "react";
import { useProgress, Environment, OrbitControls , Text3D, Center} from "@react-three/drei";
import gsap from "gsap";
import {Canvas} from "@react-three/fiber";

function Loader({ onStarted }) {
    const {progress} = useProgress();
    const [fogArgs, setFogArgs] = useState(['#fff', 1, 1]);
    let roundedProgess = Math.round(progress );



    useEffect(() => {
        if (roundedProgess >= 100) {
            onStarted();
        }
    })



    return (
       <>
           <div style={{
               backgroundColor: "#000",
               zIndex:1001,
               position: "fixed",
               top: 0,
               left: 0,
                width: "100vw",
               height: "100vh",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               color: "wheat"
           }}>
               <h1>{roundedProgess} %</h1>
           </div>
       </>
    );
}

export default Loader;
