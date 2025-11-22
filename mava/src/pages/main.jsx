import React, {useRef, useState, useEffect, Suspense} from "react";
import {Canvas, useThree} from "@react-three/fiber";
import {OrbitControls, Sky, ContactShadows, Environment} from "@react-three/drei";
import Model from "../components/3dmodel.jsx";
import Loader from "../components/loader.jsx";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
import {Link, useNavigate} from 'react-router-dom';

function Main() {
    const [start, setStart] = useState(false);
    const navigator = useNavigate();
    const camPos_A = [0, 120, 0];
    const camPos_B = [0, 40, 120];
    const camPos_C = [-40, 20, 0];

    const center_object_look = [0, 1, 0];
    const left_object_look = [-30,20,0]


    let [enableScroll, setEnableScroll] = useState(false);
    let [firstAnimationReached, setFirstAnimation] = useState(false);
    let [secondAnimationReached, setSecondAnimation] = useState(false);


    const cameraTimeline = useRef(null);
    const [camPos, setCamPos] = useState(camPos_A);
    const [camTarget, setCamTarget] = useState(center_object_look);


    const controlsRef = useRef(null);




    const CameraController = ({ camPos, camTarget, controlsRef }) => {
        const { camera } = useThree();

        useEffect(() => {
            camera.position.set(...camPos);

        }, [camera, camPos, camTarget, controlsRef]);

        return null;
    };


    const brandName = useRef(null);
    const brandSlogan = useRef(null);
    const brandScroll = useRef(null);


    const goToFirstAnimation = () => {
        const tl = gsap.timeline();
        tl.to(brandSlogan.current, {
            duration: 1.2,
            ease: "power3.out",
            css: {
                transform: "translateY(-300%)",
                transition: "all 0.3s",
            }
        }, "-=2")
        tl.to(brandName.current, {
            duration: 1.2,
            ease: "power3.out",
            css: {
                transform: "translateY(-200%)",
                transition: "all 0.3s",
            }
        }, "-=2")
        tl.to(camPos, {
            0: camPos_B[0],
            1: camPos_B[1],
            2: camPos_B[2],
            duration: 2,
            ease: "power3.out",
            onUpdate: () => setCamPos([...camPos])
        }, )
        tl.to(brandScroll.current, {
            duration: 1.2,
            ease: "power3.out",
            css: {
                transform: "translateY(200%)",
                transition: "all 0.3s",
                display: "none",
            },
            onComplete: () => setEnableScroll(true)

        }, "-=2" )


    }


    const goToSecondAnimation = () => {
        const tl = gsap.timeline();
        tl.to(camPos, {
            0: camPos_C[0],
            1: camPos_C[1],
            2: camPos_C[2],
            duration: 2.5,
            ease: "power3.out",
            onUpdate: () => setCamPos([...camPos])
        }, )
        tl.to(camTarget, {
            0: left_object_look[0],
            1: left_object_look[1],
            2: left_object_look[2],
            duration: 2,
            ease: "power3.out",
            onUpdate: () => setCamTarget([...camTarget]),
        }, "-=2.5")

        tl.call(
            () => {
                navigator("/truck/")
            },
            null,
            1.3 // абсолютное время на таймлайне (1.5 сек от начала)
        );
    }

    const scrollCanvas = (e) => {
        console.log("Scrolling")
        if (enableScroll) {
            if (e.deltaY > 0) {
                if(!firstAnimationReached && !secondAnimationReached) {
                    goToFirstAnimation()
                    setFirstAnimation(true);
                    setEnableScroll(false);
                    console.log("First animation");
                }
                else{
                    if(!secondAnimationReached && firstAnimationReached) {
                        goToSecondAnimation()
                        setSecondAnimation(true);
                        console.log("Second animation");
                    }
                }

            }
            else{

            }
        }

    }


    useEffect(() => {

        const tl = gsap.timeline()

        tl.to(brandName.current, {
            duration: 1,
            scrambleText: {
                text: "MAVA",
                speed:3,
                chars: "MAVAGTHETR"
            },
            delay: 3
        }, ">=2")

            .to(brandSlogan.current, {
                duration: 2,
                scrambleText: {
                    text: "The Perfect Time",
                    speed:1,
                    chars: "ThePerfectTime"
                }
            })

            .to(brandScroll.current, {
                duration: 2,
                scrambleText: {
                    text: "SCROLL TO BOTTOM ...",
                    speed:1,
                    chars: "ScrollToBottom"
                }
            }, "-=1")
            .to(brandScroll.current, {
                y: -30,             // вверх на 10px
                duration: 0.6,
                ease: "power1.inOut", // прыжок
                repeat: -1,         // бесконечно
                yoyo: true,         // туда-сюда
                repeatDelay: 0.4,
                onStart: () => setEnableScroll(true)// пауза между подпрыгиваниями
            }, ">");
    }, [])


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
                    <OrbitControls
                        enablePan={true}
                        enableZoom={false}
                        enableRotate={true}
                        ref={controlsRef}
                        target={camTarget}
                        maxPolarAngle={Math.PI / 2}
                        maxTargetRadius={10}
                    ></OrbitControls>
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
                <Loader onStarted={() => setStart(true)} />
            )}




            <>
                <div className="contact-us position-fixed top-0 end-0 me-5 mb-5 mt-2">
                    <div className="contact-us-glass px-4 py-3 px-md-5 py-md-3">
                        <Link to={"/contact/"} className="fs-3 fs-md-1 mb-0" style={{color:"#AD1C42"}}>Contact us</Link>
                    </div>
                </div>

                <div className="brand-header position-fixed top-0 start-50 translate-middle-x mt-3 w-100">
                    <h1 className="fs-md-1 text-white mb-0 text-center brand-name" ref={brandName}></h1>
                    <h3 className="mb-0 text-black text-center brand-slogan" ref={brandSlogan}></h3>
                </div>

                <div className="brand-header position-fixed bottom-0 start-50 translate-middle-x mt-3 mb-3">
                    <h3 className="mb-0 text-black text-center brand-scroll" ref={brandScroll}></h3>
                </div>
            </>


        </>
    )
}

export default Main;