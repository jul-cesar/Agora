export const getLatestNews = async () => {
    const response = await fetch("http://localhost:3000/api/agora/news");
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    return response.json();
}