from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from asyncio import run
from urllib.parse import urljoin
import json

async def scrape_elespectador():
    async with AsyncWebCrawler() as crawler:
        # 1. Extraer links de portada
        schema_links = {
            "name": "news_links",
            "baseSelector": ".Card-Title > a",
            "fields": [
                {"name": "href", "selector": "this::attr(href)", "type": "text"}
            ]
        }
        strategy_links = JsonCssExtractionStrategy(schema_links)
        config_links = CrawlerRunConfig(extraction_strategy=strategy_links)

        result_links = await crawler.arun(
            url="https://www.elespectador.com/politica",
            config=config_links
        )

        if not result_links.success:
            print("❌ Error al extraer links")
            return

        all_links = result_links.links.get("internal", [])

        # Normalizar y filtrar
        article_links = [
            urljoin("https://www.elespectador.com", item["href"])
            for item in all_links
            if "/politica/" in item["href"]
            and not any(x in item["href"] for x in ["/archivo", "/terminos", "/ee-play"])
        ]

        print(f"✅ Links filtrados: {len(article_links)}")

        # 2. Extraer detalles
        noticias = []
        schema_detail = {
            "name": "news_detail",
            "baseSelector": "section",
            "fields": [
                {"name": "title", "selector": ".ArticleHeader-Title", "type": "text"},
                {"name": "author", "selector": ".ArticleHeader-Author > a", "type": "text"},
                {"name": "date", "selector": ".ArticleHeader-Date", "type": "text"},
             
                {"name": "body_list", "selector": ".font--secondary", "type": "text-list"},
               
                {"name": "body_container", "selector": ".Article-Content", "type": "text"}
            ]
        }
        strategy_detail = JsonCssExtractionStrategy(schema_detail)

        for url in article_links:
            config_detail = CrawlerRunConfig(extraction_strategy=strategy_detail)
            detail_res = await crawler.arun(url, config=config_detail)

            if detail_res.success:
                data = json.loads(detail_res.extracted_content)

                if data:
                    noticia = data[0]
                    
                    # Procesar el body - intentar con lista primero, luego alternativa
                    body_text = ""
                    
                    # Intentar primero con la lista
                    if noticia.get("body_list") and isinstance(noticia["body_list"], list) and len(noticia["body_list"]) > 0:
                        paragraphs = []
                        for p in noticia["body_list"]:
                            cleaned = p.strip()
                            if cleaned and len(cleaned) > 20:
                                paragraphs.append(cleaned)
                        body_text = " ".join(paragraphs)
                        print(f"   📝 Body extraído con lista: {len(noticia['body_list'])} párrafos")
                    
                    
                    elif noticia.get("body_container"):
                        import re
                        
                        full_text = noticia["body_container"]
                        # Limpiar y dividir en oraciones largas
                        sentences = re.split(r'[.!?]+\s+', full_text)
                        paragraphs = [s.strip() + '.' for s in sentences if len(s.strip()) > 50]
                        body_text = " ".join(paragraphs[:10])  # Limitar a primeras 10 oraciones
                        print(f"   📝 Body extraído del contenedor: {len(paragraphs)} oraciones")
                    
                    
                    noticia["body"] = body_text
                    
                    
                    if "body_list" in noticia:
                        del noticia["body_list"]
                    if "body_container" in noticia:
                        del noticia["body_container"]
                    
                    noticias.append(noticia)
                    print(f"📰 Extraída: {noticia['title'][:60]}... | Body: {'✓' if noticia.get('body') else '✗'}")
                else:
                    print(f"⚠️ Sin datos en {url}")
            else:
                print(f"⚠️ Falló en {url}")

        # 👉 Ahora sí, fuera del for
        print(f"\n📊 Total noticias extraídas: {len(noticias)}")

        # Guardar en archivo
        with open("noticias.json", "w", encoding="utf-8") as f:
            json.dump(noticias, f, ensure_ascii=False, indent=2)

        return noticias

if __name__ == "__main__":
    run(scrape_elespectador())
