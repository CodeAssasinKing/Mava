import React, {useEffect, useMemo, useRef} from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

const SEGMENT_SIZE = 25;

const getSegmentFill = (progress, index) => {
    const start = index * SEGMENT_SIZE;
    const end = start + SEGMENT_SIZE;

    if (progress <= start) return 0;
    if (progress >= end) return 100;

    return ((progress - start) / SEGMENT_SIZE) * 100;
};

function Loader({ onStarted }) {
    const { progress } = useProgress();
    const roundedProgress = Math.round(progress);

    const progressPercentage = useRef(null);
    const progressBarRefs = useRef([]);
    const animated = useRef(false); // 🔥 флаг "анимация уже была"
    const loaderContainer = useRef(null);
    const fills = useMemo(
        () => [0, 1, 2, 3].map((i) => getSegmentFill(progress, i)),
        [progress]
    );

    useEffect(() => {
        if (progress >= 100 && !animated.current) {
            animated.current = true; // больше не запускать

            const tl = gsap.timeline();

            tl.to(progressPercentage.current, {
                duration: 1,
                opacity: 0,
            });

            tl.to(progressBarRefs.current[0], {
                duration: 0.3,
                rotate: -12,

            }, "<"); // "<" — одновременно с предыдущим шагом

            tl.to(progressBarRefs.current[1], {
                duration: 0.3,
                rotate: 12,
            }, "<");

            tl.to(progressBarRefs.current[2], {
                duration: 0.3,
                rotate: -6,
            }, "<");

            tl.to(progressBarRefs.current[3], {
                duration: 0.3,
                rotate: 6,
            }, "<");

            tl.to(progressBarRefs.current[0], {
                y: -60,
                x: 120,
                rotate: -70,
                width: "35vw"
            })

            tl.to(progressBarRefs.current[1], {
                y: -60,
                x: 40,
                rotate: 70
            })

            tl.to(progressBarRefs.current[2], {
                y: -60,
                x: -40,
                rotate: -70
            })

            tl.to(progressBarRefs.current[3], {
                y: -60,
                x: -120,
                rotate: 70,
                width: "35vw"
            })
            tl.to(loaderContainer.current, {
                duration: 0.8,
                scale: 10,                       // вместо css.transform
                transformOrigin: "50% 50%",      // из центра
                ease: "power2.in",
                opacity: 0,
                zIndex: 100,
            })
        }
    }, [progress]);

    return (
        <div className="LoaderContainer" ref={loaderContainer}>
            <h1 className="loader-percentage" ref={progressPercentage}>
                {roundedProgress} %
            </h1>

            <div className="loader-div">
                {fills.map((fill, i) => (
                    <div
                        className="loader"
                        key={i}
                        ref={el => (progressBarRefs.current[i] = el)}
                    >
                        <div
                            className="loader-bar"
                            style={{ width: `${fill}%` }}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Loader;
