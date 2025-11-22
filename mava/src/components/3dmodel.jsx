import React, {useRef} from "react";
import {useGLTF, Clone} from "@react-three/drei";


const Model = ({url, position, scale, rotation}) => {
    const {scene} = useGLTF(url);
    const ref = useRef();
    return (
        <Clone ref={ref}
                   object={scene}
                   position={position}
                   scale={scale}
                   rotation={rotation}
        />
    )
}


export default Model;