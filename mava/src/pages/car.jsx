import React, {Suspense, useEffect, useRef, useState} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, Sky } from "@react-three/drei";
import Model from "../components/3dmodel.jsx";
import WhiteLoader from "../components/white_loader.jsx";
import gsap from "gsap";
import {useNavigate} from "react-router-dom";

function CameraController({ camPos, camTarget }) {
    const { camera } = useThree();


    useEffect(() => {
        camera.position.set(...camPos);
        camera.lookAt(...camTarget);
    }, [camera, camPos, camTarget]);


    return null;

}




function Car() {
    const [start, setStart] = useState(false);
    const navigate = useNavigate();

    const [camPos, setCamPos] = useState([-5, 0.2, 5]);
    const [camTarget, setCamTarget] = useState([-1, 2, 0]);

    const camPositionA = [-1, 3, -5]
    const camTargetA = [-2, 2, 0];

    const scrollCanvas = (e) =>  {
        if (e.deltaY > 0){
            console.log("Scrolling bottom")
            const tl = gsap.timeline()
            tl.to(camPos, {
                0: camPositionA[0],
                1: camPositionA[1],
                2: camPositionA[2],
                duration: 1,
                ease: "Power2.Out",
                onUpdate: () => setCamPos([...camPos]),
                onComplete: () => console.log("Cam reached!"),
            })

            tl.to(camTarget, {
                0: camTargetA[0],
                1: camTargetA[1],
                2: camTargetA[2],
                duration: 1,
                ease: "Power2.Out",
                onComplete: () => console.log("Target reached!"),
                onUpdate: () => setCamTarget([...camTarget]),
            }, "-=1" )


            tl.call(
                () => {
                    navigate("/after-car/")
                },
                null,
                3

            )

        }
        else{
            console.log("Scrolling top")
        }
    }



    const divRef = useRef(null);


    useEffect(() => {
        if (!start) return;              // пока лоадер не закончился — не анимируем
        if (!divRef.current) return;    // защита

        gsap.fromTo(
            divRef.current,
            {
                css:{
                    transform: "scale(0)",
                    opacity: 0,
                },
            },
            {
                css: {
                    transform: "scale(1)",
                    opacity: 1,
                },
                duration: 3,
                ease: "power3.out",
                delay: 1
            }
        );
    }, [start]); // <-- важное: зависим от start


    return (
        <>
            {/* 3D сцена */}
            <Canvas
                style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    top: 0,
                    left: 0,
                    zIndex: 999,
                }}
                onWheel={scrollCanvas}
            >
                <CameraController camPos={camPos} camTarget={camTarget} />
                <OrbitControls
                    enablePan
                    enableZoom={false}
                    enableRotate={true}
                    target={camTarget}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.8}
                    maxTargetRadius={10}
                />
                <Sky sunPosition={[10, 20, 5]} turbidity={100} rayleigh={1.8} />
                <Environment preset="city" />

                <Suspense fallback={null}>
                    <Model
                        url={"/models/car/car.glb"}
                        position={[-3, 0.3, 0]}
                        rotation={[0, -2, 0]}
                        scale={[1, 1, 1]}
                    />
                    {/* плоскости земли вокруг */}
                    <Model url={"/models/ground.glb"} position={[-10, 0, 0]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[30, 0, 0]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[0, 0, 30]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[-30, 0, 0]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[0, 0, -30]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[-30, 0, -30]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[30, 0, 30]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[-30, 0, 30]} scale={[10, 1, 10]} />
                    <Model url={"/models/ground.glb"} position={[30, 0, -30]} scale={[10, 1, 10]} />
                </Suspense>

                <ambientLight intensity={1.5} />
                {/*<axesHelper args={[500]}/>*/}
                {/*<gridHelper args={[30,30]}/>*/}
                <fog attach="fog" args={["#dbe9ff", 10, 15]} />
            </Canvas>

            {/* фуллскрин-лоадер пока всё грузится */}
            {!start && <WhiteLoader onStarted={() => setStart(true)} />}

            {/* liquid glass панель справа (Bootstrap) — показываем после загрузки */}

            <div
                className="position-fixed mt-5 end-0 me-5"
                style={{
                    zIndex: 1000,
                    maxWidth: "420px",
                    width: "90%",
                }}
                ref={divRef}
            >
                <div
                    className="card border-0 shadow-lg"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        borderRadius: "1.5rem",
                        border: "1px solid rgba(255,255,255,0.35)",
                        color: "#fff",
                    }}
                >
                    <div className="card-body p-4">
                        {/* бейдж + бренд */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                        <span
                            className="badge rounded-pill"
                            style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                fontSize: "0.7rem",
                                letterSpacing: ".12em",
                                textTransform: "uppercase",
                            }}
                        >
                          URBAN DELIVERY
                        </span>
                                            <span
                                                className="fw-semibold"
                                                style={{ color: "#AD1C42", fontSize: "0.8rem" }}
                                            >
                          MAVA Logistics
                        </span>
                                        </div>

                                        {/* заголовок */}
                                        <h2
                                            className="h4 fw-bold mb-2"
                                            style={{ color: "#000", letterSpacing: ".04em" }}
                                        >
                                            Compact van for city deliveries
                                        </h2>

                                        {/* описание */}
                                        <p
                                            className="mb-3"
                                            style={{ fontSize: "0.9rem", color: "rgba(0,0,0,1)" }}
                                        >
                                            Optimized for last-mile logistics in dense city traffic. Fast loading,
                                            reliable timing, and real-time tracking to keep every delivery under
                                            control.
                                        </p>

                                        {/* нижняя строка */}
                                        <div className="d-flex align-items-center justify-content-between">
                        <span
                            className="fw-semibold"
                            style={{ color: "#AD1C42", fontSize: "0.85rem" }}
                        >
                          • Same-day delivery
                        </span>
                                            <span
                                                style={{
                                                    fontSize: "0.8rem",
                                                    color: "rgba(0,0,0,0.8)",
                                                }}
                                            >
                          Load: 1.2 t · City range 350 km
                        </span>
                                        </div>
                                    </div>
                </div>
            </div>


        </>
    );
}

export default Car;
