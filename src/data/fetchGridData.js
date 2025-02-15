// Loads Singapore grid infrastructure 

export async function fetchGridData() {
    try {
        const response = await fetch("/public/data/singapore_grid.json"); // Adjust path if needed
        const data = await response.json();
        console.log("✅ Grid Data Loaded:", data);
        return data;
    } catch (error) {
        console.error("❌ Error loading grid data:", error);
        return [];
    }
}
