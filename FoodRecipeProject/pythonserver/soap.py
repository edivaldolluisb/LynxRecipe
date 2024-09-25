from zeep import Client
from zeep.transports import Transport
from requests import Session


class RecipeServiceClient:
    def __init__(self, wsdl_path):
        session = Session()
        transport = Transport(session=session)
        self.client = Client(wsdl=wsdl_path, transport=transport)

    def search_recipes(self, number=None, filter='all', query=None, maxrow=10000):
        request_data = {
            'number': number,
            'filter': filter,
            'query': query,
            'maxrow': maxrow
        }
        return self.client.service.RecipeSearch(**request_data)

    def register_recipe(self, recipe_name, recipe_number = 0,
                    ingredient = '', preparation = '', 
                    creation_date = '', 
                    image_url = "", recipe_link = "",
                    calories = 0, dish_type = 1,
                    diet_type = 2,
                    ):
        
        register_data = {
            'recipes': {
                'recipe': [
                    {
                        'recipe_name': recipe_name,
                        'recipe_number': recipe_number,
                        'ingredient': ingredient,
                        'preparation': preparation,
                        'creation_date': creation_date,
                        'image_url': image_url,
                        'recipe_link': recipe_link,
                        'calories': calories,
                        'dish_type': dish_type,
                        'diet_type': diet_type,
                    }
                ]
            }
        }
        return self.client.service.RecipeRegister(**register_data)

    def update_recipe(self, recipe_name, recipe_number,
                    ingredient, preparation, creation_date, 
                    image_url = "", recipe_link = "",
                    calories = 0, dish_type = 1,
                    diet_type = 2,):
        update_data = {
            'recipe': {
                'recipe_name': recipe_name,
                'recipe_number': recipe_number,
                'ingredient': ingredient,
                'preparation': preparation,
                'creation_date': creation_date,
                'image_url': image_url,
                'recipe_link': recipe_link,
                'calories': calories,
                'dish_type': dish_type,
                'diet_type': diet_type,
            }
        }
        return self.client.service.RecipeUpdate(**update_data)

    def delete_recipe(self, recipe_number):
        delete_data = {
            'number': recipe_number
        }
        return self.client.service.RecipeDelete(**delete_data)

# Main function
if __name__ == "__main__":
    wsdl_path = '../data/foodrecipe.wsdl'
    service_client = RecipeServiceClient(wsdl_path)

    # Buscar receitas
    search_response = service_client.search_recipes()
    print(search_response)

    print('End of search operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')

    # Registrar uma nova receita
    register_response = service_client.register_recipe(
        recipe_name='Muffins de Chocolate',
        recipe_number=None,
        ingredient='Farinha, Açúcar, Chocolate',
        preparation='Misture todos os ingredientes e asse por 20 minutos.',
        creation_date='2024-08-25'
    )
    print(register_response)

    # Atualizar uma receita existente
    update_response = service_client.update_recipe(
        recipe_name='Muffins de Chocolate',
        recipe_number='120',
        ingredient='Farinha, Açúcar, Chocolate, Nozes',
        preparation='Misture todos os ingredientes e asse por 25 minutos.',
        creation_date='2024-08-25'
    )
    print(update_response)

    # Deletar uma receita
    delete_response = service_client.delete_recipe(recipe_number='119')
    print(delete_response)
