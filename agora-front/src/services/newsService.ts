export const getLatestNews = async () => {
    const response = await fetch("/api/agora/news");
    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }
    return response.json();
}