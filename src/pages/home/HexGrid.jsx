import React, { useEffect, useRef } from "react";
import "./HexGrid.css";

export default function HexGrid() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const hexSize = 80;
    const cols = Math.ceil(window.innerWidth / (hexSize * 1.5)) + 2;
    const rows =
      Math.ceil((window.innerHeight * 2) / (hexSize * Math.sqrt(3))) + 2;

    const drawHexagon = (cx, cy) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + hexSize * Math.cos(angle);
        const y = cy + hexSize * Math.sin(angle);
        points.push([x, y]);
      }
      return points;
    };

    const allPoints = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * 1.5;
        const y =
          row * hexSize * Math.sqrt(3) +
          (col % 2 === 1 ? (hexSize * Math.sqrt(3)) / 2 : 0);

        const hexPoints = drawHexagon(x, y);

        // Draw edges
        for (let i = 0; i < 6; i++) {
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line",
          );
          line.setAttribute("x1", hexPoints[i][0]);
          line.setAttribute("y1", hexPoints[i][1]);
          line.setAttribute("x2", hexPoints[(i + 1) % 6][0]);
          line.setAttribute("y2", hexPoints[(i + 1) % 6][1]);
          line.setAttribute("class", "hex-line");
          svg.appendChild(line);
        }

        // Draw nodes
        hexPoints.forEach((point) => {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          circle.setAttribute("cx", point[0]);
          circle.setAttribute("cy", point[1]);
          circle.setAttribute("r", 2);
          circle.setAttribute("class", "hex-node");
          svg.appendChild(circle);
        });

        // Collect segments
        for (let i = 0; i < 6; i++) {
          allPoints.push({
            x1: hexPoints[i][0],
            y1: hexPoints[i][1],
            x2: hexPoints[(i + 1) % 6][0],
            y2: hexPoints[(i + 1) % 6][1],
          });
        }
      }
    }

    const tracers = [];
    for (let i = 0; i < 13; i++) {
      const tracer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      tracer.setAttribute("r", 4);
      tracer.setAttribute("class", "tracer");
      svg.appendChild(tracer);

      tracers.push({
        element: tracer,
        segmentIndex: Math.floor(Math.random() * allPoints.length),
        progress: Math.random(),
      });
    }

    const animate = () => {
      tracers.forEach((t) => {
        const s = allPoints[t.segmentIndex];
        const x = s.x1 + (s.x2 - s.x1) * t.progress;
        const y = s.y1 + (s.y2 - s.y1) * t.progress;

        t.element.setAttribute("cx", x);
        t.element.setAttribute("cy", y);

        t.progress += 0.009;
        if (t.progress >= 1) {
          t.progress = 0;
          t.segmentIndex = (t.segmentIndex + 1) % allPoints.length;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="hexagon-grid">
      <svg ref={svgRef} className="svg"></svg>
    </div>
  );
}
