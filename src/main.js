import * as THREE from "three";
import Globe from "globe.gl";
import { fetchGridData } from "./data/fetchGridData.js";

const MAPBOX_TOKEN = "pk.eyJ1IjoiaXJhbHV4eCIsImEiOiJjbTczZjN0YjgwbHA5Mm5vaG1rNzFtZmxmIn0.DOw1Krvzed9c6UqPfYcCIw"; 
document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded!");

    const container = document.getElementById("globe-container");

    if (!container) {
        console.error("❌ Error: #globe-container not found in DOM!");
        return;
    }

    console.log("✅ Globe container found, initializing...");

    try {
        const globe = Globe()(container)
            .globeImageUrl("/assets/earth-blue-marble.jpg") // ✅ Ensure correct path
            .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

        console.log("✅ Globe successfully created!");

        // ✅ Fetch Grid and Solar Data
        const gridData = await fetchGridData();
        console.log("✅ Loaded Grid Data:", gridData);

        if (!gridData || gridData.length === 0) {
            console.error("❌ No grid data available!");
            return;
        }

        // ✅ Render Points (including Solar PV data)
        globe.pointsData(gridData)
            .pointColor(d => {
                switch (d.type) {
                    case "EV": return "rgb(30, 144, 255)"; // ✅ DodgerBlue
                    case "Solar": return "rgb(255, 223, 0)"; // ✅ Bright Yellow
                    case "VPP": return "rgb(50, 205, 50)"; // ✅ Lime Green
                    default: return "rgb(255, 69, 0)"; // ✅ Red-Orange
                }
            })
            .pointAltitude(() => 0.005)  // ✅ Keep dots close to the surface
            .pointRadius(d => Math.sqrt(d.capacity) * 0.3) // ✅ Scale radius by capacity

            .onPointClick(d => {
                alert(`⚡ Clicked on ${d.name}, Type: ${d.type}, Capacity: ${d.capacity} MW`);
                console.log("✅ Clicked Data Point:", d);
            });

        console.log("✅ Points Added to Globe!");

    } catch (error) {
        console.error("❌ Error initializing the globe:", error);
    }
});

