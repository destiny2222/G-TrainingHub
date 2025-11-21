import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Pencil = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      svgRef.current,
      {
        opacity: 0,
        rotation: 90,
        scale: 0.5,
      },
      {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.5,
        ease: "back.out(1.7)",
      },
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <svg
        ref={svgRef}
        width="200px"
        height="200px"
        viewBox="0 0 192 192"
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        fill="none"
      >
        <path
          d="m104.175 90.97-4.252 38.384 38.383-4.252L247.923 15.427V2.497L226.78-18.646h-12.93zm98.164-96.96 31.671 31.67"
          className="cls-1"
          style={{
            fill: "none",
            fillOpacity: 1,
            fillRule: "nonzero",
            stroke: "#e0e0e0",
            strokeWidth: 12,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(-77.923 40.646)"
        />
        <path
          d="m195.656 33.271-52.882 52.882"
          style={{
            fill: "none",
            fillOpacity: 1,
            fillRule: "nonzero",
            stroke: "#e0e0e0",
            strokeWidth: 12,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 5,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
          transform="translate(-77.923 40.646)"
        />
      </svg>
    </div>
  );
};

export default Pencil;
