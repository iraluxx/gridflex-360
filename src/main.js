import { Deck } from "@deck.gl/core";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { TileLayer } from "@deck.gl/geo-layers";

const tileLayer = new TileLayer({
    id: "tile-layer",
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256
});


// ✅ Function to Fetch a GeoJSON File
async function fetchGeoJson(url) {
    try {
        console.log(`🔄 Fetching GeoJSON from: ${url}...`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        const data = await response.json();
        console.log(`✅ GeoJSON Loaded Successfully from: ${url}`, data);
        return data;
    } catch (error) {
        console.error(`❌ Error Fetching GeoJSON from ${url}:`, error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ DOM fully loaded!");

    // ✅ Fetch both files separately
    const boundaryData = await fetchGeoJson("/data/singapore_boundaries.geojson");
    const energyData = await fetchGeoJson("/data/singapore_energy_data.geojson");

    if (!boundaryData || !energyData) {
        console.error("❌ No valid boundary or energy data.");
        return;
    }

    // ✅ Separate Energy Data into Categories
    const powerStations = energyData.features.filter(f => f.properties.type === "power_station");
    const substations = energyData.features.filter(f => f.properties.type === "substation");
    const electricalTowers = energyData.features.filter(f => f.properties.type === "electrical_tower");
    const gasStations = energyData.features.filter(f => f.properties.type === "gas_station");

    console.log("✅ Power Stations:", powerStations);
    console.log("✅ Substations:", substations);
    console.log("✅ Electrical Towers:", electricalTowers);
    console.log("✅ Gas Stations:", gasStations);

    // ✅ Singapore Boundaries Layer (Force-Render)
    const boundaryLayer = new GeoJsonLayer({
        id: "boundary-layer",
        data: boundaryData,
        stroked: true,
        filled: true,
        extruded: false,  // ✅ Ensure the boundary is flat, not 3D
        getFillColor: [50, 50, 150, 100], // Blue-gray transparent
        getLineColor: [255, 255, 255, 200], // White border
        opacity: 0.6
    });
    

    // ✅ Scatterplot Layer: Power Stations (Force-Render)
    const powerLayer = new ScatterplotLayer({
        id: "power-layer",
        data: powerStations,
        getPosition: d => d.geometry.coordinates,
        getRadius: d => Math.sqrt(d.properties.capacity) * 50,
        getFillColor: [255, 0, 0, 200], // Red for power stations
        pickable: true,
        onClick: ({ object }) => {
            alert(`⚡ Power Station: ${object.properties.name}, Capacity: ${object.properties.capacity} MW`);
        }
    });

    // ✅ Scatterplot Layer: Substations
    const substationLayer = new ScatterplotLayer({
        id: "substation-layer",
        data: substations,
        getPosition: d => d.geometry.coordinates,
        getRadius: 200,
        getFillColor: [0, 0, 255, 200], // Blue for substations
        pickable: true
    });

    // ✅ Scatterplot Layer: Electrical Towers
    const towerLayer = new ScatterplotLayer({
        id: "tower-layer",
        data: electricalTowers,
        getPosition: d => d.geometry.coordinates,
        getRadius: 150,
        getFillColor: [255, 165, 0, 200], // Orange for electrical towers
        pickable: true
    });

    // ✅ Heatmap Layer: Energy Density (Force-Render)
    const heatmapLayer = new HeatmapLayer({
        id: "heatmap-layer",
        data: [...powerStations, ...substations],
        getPosition: d => d.geometry.coordinates,
        getWeight: d => d.properties.capacity || 1,
        radiusPixels: 40
    });

    // ✅ Initialize Deck.gl (Force-Render)
    const deck = new Deck({
        canvas: "deck-canvas",
        initialViewState: {
            longitude: 103.8198,
            latitude: 1.3521,
            zoom: 5,  // ✅ Zoom out a bit to see the whole region
            minZoom: 3,
            maxZoom: 15,
            pitch: 45,  // ✅ Keep a natural viewing angle
            bearing: 0
        },
        controller: true,
        layers: [tileLayer, boundaryLayer, powerLayer, substationLayer, towerLayer, heatmapLayer]
    });
    

    console.log("✅ Deck.gl initialized!");
    console.log("✅ Rendering Layers:", deck.props.layers);
});
