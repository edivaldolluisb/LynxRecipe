from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from soap import RecipeServiceClient
from zeep.helpers import serialize_object
from collections import OrderedDict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# WSDL path
wsdl_path = '../data/foodrecipe.wsdl'

# Soap Client
service_client = RecipeServiceClient(wsdl_path)

# Pydantic models for data
class RecipeBase(BaseModel):
    recipe_name: str
    ingredient: str | None
    preparation: Optional[str] = None
    creation_date: Optional[datetime] = None
    image_url: Optional[str] = None
    recipe_link: Optional[str] = None
    calories:Optional[int] = 0
    dish_type:Optional[int] = 1
    diet_type:Optional[int] = 1


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(RecipeBase):
    recipe_number: int = Field(..., description="Recipe number to update")


class RecipeResponse(RecipeBase):
    recipe_number: int


# main page 
@app.get("/")
def home():
    return {"message": "Welcome to the FastAPI Food Recipe API!", "docs_url": "/docs"}

@app.get("/recipes", response_model=dict)
def search_recipes( number: Optional[int] = None, filter: str = 'all', query: Optional[str] = None, maxrow: int = 10000,
                    min_recipe_number: Optional[int] = Query(None, description="Minimum recipe number"),
                    max_recipe_number: Optional[int] = Query(None, description="Maximum recipe number"),
                    min_creation_date: Optional[datetime] = Query(None, description="Minimum creation date"),
                    max_creation_date: Optional[datetime] = Query(None, description="Maximum creation date"),
                    name: Optional[str] = Query(None, description="Recipe name"),
                    ingredient: Optional[str] = Query(None, description="Recipe Ingredient"),
                    preparation: Optional[str] = Query(None, description="Recipe Preparation")
                    ):
    try:
        if min_recipe_number:
            print(f"Min recipe number: {min_recipe_number}")
            response = service_client.search_recipes(number=min_recipe_number, filter="min_recipe_number")
        elif max_recipe_number:
            print(f"Max recipe number: {max_recipe_number}")
            response = service_client.search_recipes(number=max_recipe_number, filter="max_recipe_number")
        elif min_creation_date:
            print(f"Min creation date: {min_creation_date}")
            response = service_client.search_recipes(filter="min_creation_date", query=min_creation_date)
        elif max_creation_date:
            print(f"Max creation date: {max_creation_date}")
            response = service_client.search_recipes(filter="max_creation_date", query=max_creation_date)
        elif name:
            print(f"Recipe name: {name}")
            response = service_client.search_recipes(filter="name", query=name)
        elif ingredient:
            print(f"Recipe ingredient: {ingredient}")
            response = service_client.search_recipes(filter="ingredient", query=ingredient)
        elif preparation:
            print(f"Recipe preparation: {preparation}")
            response = service_client.search_recipes(filter="preparation", query=preparation)
        else:
            response = service_client.search_recipes(number=number, filter=filter, query=query)
        response_dict = serialize_object(response)
        return response_dict  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get a single recipe
@app.get("/recipes/{recipe_number}", response_model=RecipeResponse | dict)
def get_recipe(recipe_number: int):
    try:
        response = service_client.search_recipes(number=recipe_number, filter="single")
        
        response_dict = serialize_object(response)
        
        # ifthere is no recipe, return an empty dictionary
        if not response_dict.get('recipes'):
            return {
                'msg': 'No recipe found, the recipe may not exist or has been removed.'
            }
        response_dict = dict(response_dict['recipes']['recipe'][0])

        return response_dict

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get a web result 
@app.get("/websearch", response_model=OrderedDict | dict)
def search_web(q: Optional[str] = "carrot"):
    try:
        print(q)
        response = service_client.search_recipes(filter="web", query=q)
        response_dict = serialize_object(response)
        response_dict = dict(response_dict['recipes__1'])
        return response_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/register", response_model=dict)
def register_recipe(recipe: RecipeCreate):
    try:
        print(recipe)
        response = service_client.register_recipe(
            recipe_name=recipe.recipe_name,
            ingredient=recipe.ingredient,
            preparation=recipe.preparation,
            creation_date=recipe.creation_date,
            image_url=recipe.image_url,
            recipe_link=recipe.recipe_link,
            calories=recipe.calories,
            dish_type=recipe.dish_type,
            diet_type=recipe.diet_type
        )
        response_dict = serialize_object(response)
        print(response_dict)
        
        return response_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/update", response_model=dict)
def update_recipe(recipe: RecipeUpdate):
    try:
        response = service_client.update_recipe(
            recipe_name=recipe.recipe_name,
            recipe_number=recipe.recipe_number,
            ingredient=recipe.ingredient,
            preparation=recipe.preparation,
            creation_date=recipe.creation_date,
            image_url=recipe.image_url,
            recipe_link=recipe.recipe_link,
            calories=recipe.calories,
            dish_type=recipe.dish_type,
            diet_type=recipe.diet_type
            
        )
        response_dict = serialize_object(response)
        return response_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/recipes/{recipe_number}", response_model=dict)
def delete_recipe(recipe_number: int):
    try:
        response = service_client.delete_recipe(recipe_number=recipe_number)
        response_dict = serialize_object(response)
        print('deleting a recipe: ',response_dict)
        return {"message": response_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# uvicorn main:app --reload