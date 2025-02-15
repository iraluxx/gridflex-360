import * as THREE from "three";
import Globe from "globe.gl";
import { fetchGridData } from "./src/data/fetchGridData.js";


const MAPBOX_TOKEN = "pk.eyJ1IjoiaXJhbHV4eCIsImEiOiJjbTczZjN0YjgwbHA5Mm5vaG1rNzFtZmxmIn0.DOw1Krvzed9c6UqPfYcCIw"; 

const container = document.getElementById("globe-container");

if (!container) {
    console.error("❌ Error: #globe-container not found in DOM!");
} else {
    console.log("✅ Globe container found!");
}

const globe = Globe()(container)
  .globeImageUrl(
    `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,0,1/1024x512?access_token=${MAPBOX_TOKEN}`
  )
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

loadGridData();

// Enable camera controls for interactivity
globe.controls().enabled = true;
globe.controls().autoRotate(true).autoRotateSpeed(0.5);
globe.pointOfView({ altitude: 2.5 });

// Ensure the container exists
if (!container) {
  console.error("Error: Container not found!");
}

// Fix material
globe.globeMaterial(new THREE.MeshStandardMaterial({
  color: 0x113355,
  emissive: 0x112244,
  roughness: 0.8,
  metalness: 0.5,
}));

// Create tooltip element
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.background = "rgba(0,0,0,0.7)";
tooltip.style.color = "white";
tooltip.style.padding = "5px";
tooltip.style.borderRadius = "4px";
tooltip.style.display = "none";
document.body.appendChild(tooltip);

// Enable interactivity: Click
globe.onGlobeClick(({ lat, lng }) => {
  alert(`Clicked at latitude: ${lat}, longitude: ${lng}`);
  console.log(`Clicked at ${lat}, ${lng}`);
});

// Enable interactivity: Hover
globe.onHover((marker, event) => {
  if (marker) {
    tooltip.innerHTML = `${marker.name}: ${marker.value}`;
    tooltip.style.display = "block";
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.top = `${event.clientY + 10}px`;
  } else {
    tooltip.style.display = "none";
  }
});

// Ensure the globe is interactive
globe.controls().enableRotate = true;
globe.controls().enableZoom = true;

// Test Hover
globe.onGlobeHover(({ lat, lng }) => {
  console.log(`Hovered at ${lat}, ${lng}`);
});

// Energy data 
async function loadGridData() {
  const gridData = await fetchGridData();
  if (!gridData || gridData.length === 0) {
      console.error("❌ No grid data available!");
      return;
  }

  console.log("✅ Applying Grid Data to Globe:", gridData);

  globe.pointsData(gridData)
      .pointColor(d => d.type === "EV" ? "blue" : d.type === "Solar" ? "yellow" : "red")
      .pointAltitude(d => d.capacity / 100)
      .pointRadius(0.5);
}

const myGridConnections = [
  { startLat: 37.7749, startLng: -122.4194, endLat: 51.5074, endLng: -0.1278 },
];

console.log("Energy Data:", myEnergyData);
console.log("Grid Connections:", myGridConnections);

if (!myEnergyData || myEnergyData.length === 0) {
  console.error("Error: myEnergyData is empty!");
}

if (!myGridConnections || myGridConnections.length === 0) {
  console.error("Error: myGridConnections is empty!");
}


// Add markers
globe.pointsData(myEnergyData)
  .pointColor(d => d.type === "EV" ? "blue" : d.type === "VPP" ? "green" : "red")
  .pointAltitude(d => d.capacity / 100)
  .pointRadius(0.5);

// Add arcs (energy flow)
globe.arcsData(myGridConnections)
  .arcDashLength(0.5)
  .arcColor(() => "rgba(255, 165, 0, 0.75)")
  .arcDashGap(0.3);


  