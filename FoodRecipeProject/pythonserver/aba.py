from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from zeep import Client

app = FastAPI()

# Configurar o cliente SOAP
wsdl = 'URL_DO_SEU_WSDL'
client = Client(wsdl)

class Recipe(BaseModel):
    recipe_number: int
    recipe_name: str
    ingredients: str
    preparation: str
    creation_date: str

@app.get("/recipes", response_model=List[Recipe])
def search_recipes(
    min_recipe_number: Optional[int] = Query(None, description="Número mínimo da receita"),
    max_recipe_number: Optional[int] = Query(None, description="Número máximo da receita"),
    min_creation_date: Optional[str] = Query(None, description="Data mínima de criação no formato YYYY-MM-DD"),
    max_creation_date: Optional[str] = Query(None, description="Data máxima de criação no formato YYYY-MM-DD"),
    name: Optional[str] = Query(None, description="Nome da receita"),
    ingredient: Optional[str] = Query(None, description="Ingrediente"),
    preparation: Optional[str] = Query(None, description="Preparo")
):
    try:
        # Construir o filtro baseado nos parâmetros fornecidos
        filters = {}
        if min_recipe_number is not None:
            filters['min_recipe_number'] = min_recipe_number
        if max_recipe_number is not None:
            filters['max_recipe_number'] = max_recipe_number
        if min_creation_date is not None:
            filters['min_creation_date'] = min_creation_date
        if max_creation_date is not None:
            filters['max_creation_date'] = max_creation_date
        
        # Chamar o serviço SOAP com os filtros
        response = client.service.SearchRecipes(filters)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
