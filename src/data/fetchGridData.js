export async function fetchGridData() {
    try {
        const response = await fetch("/data/singapore_grid.json");
        if (!response.ok) throw new Error("Failed to load grid data");

        const data = await response.json();

        // ✅ Add small random offsets to prevent overlap
        return data.map(d => ({
            ...d,
            lat: d.lat + (Math.random() * 0.02 - 0.01), // Scatter within ~2km range
            lng: d.lng + (Math.random() * 0.02 - 0.01)
        }));
    } catch (error) {
        console.error("❌ Error fetching grid data:", error);
        return [];
    }
}
