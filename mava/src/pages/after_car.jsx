import React, {useRef, useState, useEffect, Suspense} from "react";
import {Canvas, useThree} from "@react-three/fiber";
import {OrbitControls, Sky, ContactShadows, Environment} from "@react-three/drei";
import Model from "../components/3dmodel.jsx";
import WhiteLoader from "../components/white_loader.jsx";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
import {Link, useNavigate} from 'react-router-dom';

function Main() {
    const [start, setStart] = useState(false);

    const navigator = useNavigate();
    const camPos_A = [0, 50, -15];
    const camPos_B = [0, 50, -70];
    const camPos_C = [30, 20, -15];


    const center_object_look = [0,50,-50];
    const red_crystal_look = [-25,50,0];
    const red_crystal_look2 = [0,50,0];

    const white_crystal_look = [30,20,0];



    let [enableScroll, setEnableScroll] = useState(false);

    const [camPos, setCamPos] = useState(camPos_A);
    const [camTarget, setCamTarget] = useState(center_object_look);


    useEffect(() => {
        const timeline = gsap.timeline();

        timeline.to(camPos, {
            0: camPos_B[0],
            1: camPos_B[1],
            2: camPos_B[2],
            duration: 2,
            ease: "power1.inOut",
            onUpdate: () => setCamPos([...camPos]),
            delay: 2
        })
        timeline.to(camTarget, {
            0: red_crystal_look[0],
            1: red_crystal_look[1],
            2: red_crystal_look[2],
            duration: 2,
            ease: "power2.inOut",
            onUpdate : () => setCamTarget([...camTarget])
        }, "-=2" )
        timeline.to(camTarget, {
            0: red_crystal_look2[0],
            1: red_crystal_look2[1],
            2: red_crystal_look2[2],
            duration: 2,
            ease: "power2.inOut",
            onUpdate : () => setCamTarget([...camTarget]),
            onComplete: setEnableScroll(true)
        }, "-=1")


    }, [])



    const look_right_white_crystal = () => {
        const timeline = gsap.timeline()
        timeline.to(camPos, {
            0: camPos_C[0],
            1: camPos_C[1],
            2: camPos_C[2],
            duration: 2,
            ease: "power1.inOut",
            onUpdate : () => setCamPos([...camPos]),
        })

        timeline.to(camTarget, {
            0: white_crystal_look[0],
            1: white_crystal_look[1],
            2: white_crystal_look[2],
            duration: 2,
            ease: "power2.inOut",
            onUpdate : () => setCamTarget([...camTarget]),
            onComplete: setEnableScroll(false),
        }, "-=2")
        timeline.call(
            () => {
                navigator("/airplane/")
            },
            null,
            2

        )
    }


    const CameraController = ({ camPos, camTarget }) => {
        const { camera } = useThree();

        useEffect(() => {
            camera.position.set(...camPos);

        }, [camera, camPos, camTarget]);

        return null;
    };


    const scrollCanvas = (e) => {
        if (enableScroll) {
            if (e.deltaY > 0) {
                look_right_white_crystal()
            }
            else{
                console.log("Scrolling top")
            }
        }

    }


    return (
        <>

            <Canvas
                style={{
                    height: "100vh",
                    width: "100vw",
                    top: 0,
                    left: 0,
                    position: "fixed",
                    zIndex: 999,
                }}
                onWheel={scrollCanvas}
            >
                <Suspense fallback={null}>
                    <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} target={camTarget} ></OrbitControls>
                    <Environment preset={"sunset"}/>
                    <CameraController camPos={camPos} camTarget={camTarget} />
                    <Sky
                        sunPosition={[12, 18, 8]}
                        turbidity={100}
                        rayleigh={1.8}
                    />

                    <ContactShadows
                        position={[0, 0.01, 0]} // почти на полу
                        opacity={0.4}
                        scale={60}              // если сцена большая
                        blur={3}
                        far={80}
                    />


                    {/* mountain */}
                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[0,0,0]}
                           scale={[500,0,500]}
                           rotation={[0,0,0]}
                    />

                    {/* mounatins x-z   -x-(-z)*/}
                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[450,-200,0]}
                           scale={[400,750,400]}
                           rotation={[0,0,0]}
                    />

                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[-450,-100,0]}
                           scale={[400,550,400]}
                           rotation={[0,0,0]}
                    />


                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[0,-100,450]}
                           scale={[400,650,400]}
                           rotation={[0,0,0]}
                    />

                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[0,-100,-450]}
                           scale={[400,700,400]}
                           rotation={[0,0,0]}
                    />


                    {/*mountains corner*/}

                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[450,-100,-450]}
                           scale={[400,600,400]}
                           rotation={[0,0,0]}
                    />


                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[-450,-100,450]}
                           scale={[400,450,400]}
                           rotation={[0,0,0]}
                    />


                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[-450,-100,-450]}
                           scale={[400,400,400]}
                           rotation={[0,0,0]}
                    />

                    <Model url="/models/mountain/hero_mountain.glb"
                           position={[450,-100,450]}
                           scale={[400,550,400]}
                           rotation={[0,0,0]}
                    />


                    {/* rombs */}
                    <Model url="/models/romb-belyy.glb"
                           position={[30,20,0]}
                           scale={[10,10,10]}
                           rotation={[0,0,0]}
                    />

                    <Model url="/models/romb-belyy.glb"
                           position={[-30,20,0]}
                           scale={[10,10,10]}
                           rotation={[0,0,0]}
                    />

                    <Model url="/models/romb-bordowyy.glb"
                           position={[0,50,0]}
                           scale={[10,10,10]}
                           rotation={[0,0,0]}
                    />






                    <directionalLight position={[15,10,15]} intensity={10} color={0xffffff}></directionalLight>
                    <directionalLight position={[-15,10,-15]} intensity={10} color={0xffffff}></directionalLight>

                    <ambientLight intensity={3} />
                    {/*<axesHelper args={[500]}/>*/}
                    {/*<gridHelper args={[30,30]}/>*/}
                    <fog attach="fog" args={['#dbe9ff', 150, 600]} />
                </Suspense>
            </Canvas>
            {!start && (
                <WhiteLoader onStarted={() => setStart(true)} />
            )}



        </>
    )
}

export default Main;