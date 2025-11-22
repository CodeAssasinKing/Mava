import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars, OrbitControls } from "@react-three/drei";
import Model from "../components/3dmodel.jsx";         // поправь путь, если другой
import Loader from "../components/loader.jsx";
import StatusModal from "../components/statusModal.jsx";// и это тоже

function Contact() {
    const [start, setStart] = useState(false);

    const [modalType, setModalType] = useState(null); // "success" | "error" | null
    const handleSubmit = (e) => {
        e.preventDefault();

        // здесь твоя логика отправки (fetch/axios и т.д.)
        // пока просто пример:

        const isOk = Math.random() > 0.5; // ЗАМЕНИ на реальный результат

        if (isOk) {
            setModalType("success");
        } else {
            setModalType("error");
        }
    };

    const closeModal = () => setModalType(null);
    return (
        <>
            <Canvas
                style={{
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 999,
                    backgroundColor: "black",
                }}
                shadows
            >
                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <Stars
                        radius={200}
                        depth={100}
                        count={10000}
                        factor={4}
                        saturation={1}
                        fade
                        speed={2}
                    />

                    <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />

                    <Model
                        url={"/models/earth/earth.glb"}
                        position={[-1.5, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={[2, 2, 2]}
                    />

                    <ambientLight intensity={3} />
                </Suspense>
            </Canvas>

            {!start && <Loader onStarted={() => setStart(true)} />}

            {/* CONTACT FORM – fixed right glassy panel */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    right: "3rem",
                    transform: "translateY(-50%)",
                    zIndex: 1000,
                    maxWidth: "380px",
                    width: "90%",
                }}
            >
                <div
                    className="card shadow-lg border-0"
                    style={{
                        background: "rgba(0, 0, 0, 0.55)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderRadius: "1.25rem",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                    }}
                >
                    <div className="card-body p-4">
                        <h5
                            className="mb-1"
                            style={{ letterSpacing: ".05em", textTransform: "uppercase", fontSize: "0.8rem", color: "#adb5bd" }}
                        >
                            Contact
                        </h5>
                        <h3
                            className="mb-3"
                            style={{ fontWeight: 700, color: "#ffffff" }}
                        >
                            Let&apos;s talk
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-light">Name</label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-0"
                                    placeholder="Your name"
                                    style={{ borderRadius: "999px", fontSize: "0.9rem" }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light">Email</label>
                                <input
                                    type="email"
                                    className="form-control bg-dark text-light border-0"
                                    placeholder="you@example.com"
                                    style={{ borderRadius: "999px", fontSize: "0.9rem" }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light">Subject</label>
                                <input
                                    type="text"
                                    className="form-control bg-dark text-light border-0"
                                    placeholder="Project, question, idea..."
                                    style={{ borderRadius: "999px", fontSize: "0.9rem" }}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-light">Message</label>
                                <textarea
                                    className="form-control bg-dark text-light border-0"
                                    rows="4"
                                    placeholder="Tell me a bit more..."
                                    style={{ borderRadius: "1rem", fontSize: "0.9rem", resize: "none" }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 mt-2"
                                style={{
                                    backgroundColor: "#AD1C42",
                                    borderColor: "#AD1C42",
                                    borderRadius: "999px",
                                    fontWeight: 600,
                                    letterSpacing: ".05em",
                                    textTransform: "uppercase",
                                    fontSize: "0.8rem",
                                }}
                            >
                                Send message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <StatusModal
                show={modalType === "success"}
                type="success"
                onClose={closeModal}
            />
            <StatusModal
                show={modalType === "error"}
                type="error"
                onClose={closeModal}
            />
        </>
    );
}

export default Contact;
