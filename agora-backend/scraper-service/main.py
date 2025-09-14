from fastapi import FastAPI

from scrape import scrape_elespectador  # importas tu función

app = FastAPI(title="Scraper API", version="1.0.0")

@app.get("/scrape")
def run_scraper():
    try:
        noticias = scrape_elespectador()  # ya es async
        return {"total": len(noticias), "data": noticias}
    except Exception as e:
        return {"error": str(e)}