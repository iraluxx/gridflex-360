export async function fetchGridData() {
    try {
        // Load the existing grid data
        const response = await fetch("/data/singapore_grid.json");
        if (!response.ok) throw new Error("Failed to load grid data");

        const gridData = await response.json();

        // Manually add Solar PV Data
        const solarData = [
            { name: "Private Sector", lat: 1.3, lng: 103.8, type: "Solar", capacity: 235.5 },
            { name: "Public Service Agencies", lat: 1.3644, lng: 103.9915, type: "Solar", capacity: 25.4 },
            { name: "Residential", lat: 1.3521, lng: 103.8198, type: "Solar", capacity: 15.7 },
            { name: "Town Councils & Grassroots Units", lat: 1.3451, lng: 103.9532, type: "Solar", capacity: 167.0 }
        ];

        // Merge solar data with grid data
        const fullData = [...gridData, ...solarData];

        console.log("✅ Grid and Solar Data Loaded:", fullData);
        return fullData;
    } catch (error) {
        console.error("❌ Error fetching grid data:", error);
        return [];
    }
}
