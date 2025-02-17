export async function fetchGridData() {
    try {
        console.log("🔄 Fetching grid data...");

        const response = await fetch("/data/singapore_grid.json");
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const gridData = await response.json();

        console.log("✅ Grid data loaded:", gridData);

        if (!gridData || gridData.length === 0) {
            console.error("❌ Grid data is empty!");
            return { fullData: [], totalCapacity: 0 };
        }

        // Compute total energy storage capacity
        const totalCapacity = gridData.reduce((sum, d) => sum + d.capacity, 0);
        console.log("⚡ Total Energy Capacity:", totalCapacity, "MW");

        return { fullData: gridData, totalCapacity };
    } catch (error) {
        console.error("❌ Error fetching grid data:", error);
        return { fullData: [], totalCapacity: 0 };
    }
}
