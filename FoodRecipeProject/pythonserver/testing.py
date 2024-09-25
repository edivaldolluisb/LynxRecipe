from zeep import Client
from zeep.transports import Transport
from requests import Session
 
# WSDL path
wsdl = '../data/foodrecipe.wsdl'
 
# Client transport session configuration
session = Session()
transport = Transport(session=session)
 
# Client instance
client = Client(wsdl=wsdl, transport=transport)
 
# Solicitação de busca de receitas
request_data = {
    'number': 116,
    'filter': 'web',
    'query': 'meat',
    'maxrow': 10000
}
 
# Envie a solicitação
response = client.service.RecipeSearch(**request_data)
print(response)
print('\n End of search operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')

# Exemplo de registro de nova receita
register_data = {
    'recipes': {
        'recipe': [
            {
                'recipe_name': 'Muffins de Chocolate',
                'recipe_number': None,
                'ingredient': 'Farinha, Açúcar, Chocolate',
                'preparation': 'Misture todos os ingredientes e asse por 20 minutos.',
                'creation_date': None
            }
        ]
    }
}
response = client.service.RecipeRegister(**register_data)
print(response)
print('\n End of register operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')

print('\n Start of update operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')

# Exemplo de atualização de receita
update_data = {
    'recipe': {
        'recipe_name': 'Muffins de Chocolate',
        'recipe_number': 116,
        'ingredient': 'Farinha, Açúcar, Chocolate, Nozes',
        'preparation': 'Misture todos os ingredientes e asse por 25 minutos.',
        'creation_date': None
    }
}
response = client.service.RecipeUpdate(**update_data)
print(response)
print('\n End of update operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')
print('\n start of delete operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')

# Exemplo de deleção de receita
delete_data = {
    'number': '129'
}
response = client.service.RecipeDelete(**delete_data)
print(response)
print('\n End of delete operation. +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ \n')
