CREATE DATABASE IF NOT EXISTS MyRecipes;

USE MyRecipes;

CREATE TABLE IF NOT EXISTS RECIPE (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_number INT UNIQUE,    
    ingredient VARCHAR(1000),
    preparation VARCHAR(2000),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(1000),
    recipe_link VARCHAR(1000),
    calories INT DEFAULT 0,  -- Calorias da receita
	dish_type ENUM('Starter', 'Main dish', 'Dessert') NOT NULL,  -- Tipo de prato
	diet_type ENUM('Fish', 'Meat', 'Vegetarian', 'Vegan') NOT NULL  -- Categoria alimentar
);

DELIMITER //

CREATE TRIGGER before_insert_recipe
BEFORE INSERT ON RECIPE
FOR EACH ROW
BEGIN
    SET NEW.recipe_number = (SELECT IFNULL(MAX(recipe_number), 99) + 1 FROM RECIPE);
END; //

DELIMITER ;


SELECT recipe_number, recipe_name FROM RECIPE;

INSERT INTO RECIPE (recipe_name, ingredient, preparation) VALUES 
('Receita 4', 'Ingrediente 1, Ingrediente 2', 'Passo 1, Passo 2'),
('Receita 5', 'Ingrediente A, Ingrediente B', 'Passo A, Passo B'),
('Receita 6', 'Ingrediente X, Ingrediente Y', 'Passo X, Passo Y');

SELECT recipe_number, recipe_name, ingredient, preparation FROM RECIPE;
SELECT recipe_number, recipe_name, ingredient, preparation, creation_date  FROM RECIPE;

select * from recipe;

ALTER TABLE RECIPE
ADD COLUMN calories INT,   Calorias da receita
ADD COLUMN dish_type ENUM('Starter', 'Main dish', 'Dessert') NOT NULL,  -- Tipo de prato
ADD COLUMN diet_type ENUM('Fish', 'Meat', 'Vegetarian', 'Vegan') NOT NULL;  -- Categoria alimentar

INSERT INTO RECIPE (recipe_name, ingredient, preparation, calories, dish_type, diet_type) VALUES 
('Receita 7', 'Ingrediente A, Ingrediente B', 'Passo A, Passo B', 350, 2, 2),  -- Prato Principal, Carne
('Receita 8', 'Ingrediente X, Ingrediente Y', 'Passo X, Passo Y', 150, 3, 4),  -- Sobremesa, Vegan
('Receita 9', 'Ingrediente M, Ingrediente N', 'Passo M, Passo N', 200, 1, 3);  -- Entrada, Vegetariano

UPDATE RECIPE
SET 
    ingredient = 'Ingrediente X, Ingrediente Y, Ingrediente Z',
    preparation = 'Passo 1: Preparar, Passo 2: Cozinhar, Passo 3: Servir',
    calories = 350,
    dish_type = 3, 
    diet_type = 4   
WHERE recipe_number = 156;


--------------- logs table 
CREATE TABLE IF NOT EXISTS SOAP_REQUEST_LOG (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(255) NOT NULL,  -- Tipo de ação
    success BOOLEAN NOT NULL,  -- Se foi sucesso ou não
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de request
    response_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data de response
    response_message TEXT  -- Mensagem de resposta (opcional)
);


INSERT INTO SOAP_REQUEST_LOG (action_type, success, request_date, response_date, response_message) VALUES 
('CreateOrder', TRUE, '2024-09-17 20:00:00', '2024-09-17 20:00:05', 'Order created successfully'),
('UpdateOrder', FALSE, '2024-09-17 21:00:00', '2024-09-17 21:00:03', 'Failed to update order due to validation error');

select * from SOAP_REQUEST_LOG;



