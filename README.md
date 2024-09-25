# LynxRecipe

Recipe app for managing food recipes.
## Tech Stack

**Client:** Vanilla JS, HTML, CSS

**Server:** TIBCO BW5, MySQL/PostgreSQL, Python, Fastapi

Docker - for running the Databases locally
## API Reference

#### Get all recipes

```http
  GET /recipes
```
Returns a list of all stored recipes

#### Get recipe

```http
  GET /recipes/{recipe_number}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipe_number`      | `int` | **Required**. number of the recipe to fetch |

#### Delete item

```http
  DELETE /recipes/{recipe_number}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipe_number`      | `int` | **Required**. number of the recipe to delete |

#### Web search

```http
  GET /websearch/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `query`      | `string` | **Required**. name of item to make an online search |

#### Register recipe

```http
  POST /register/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipe_name`      | `string` | **Required**. recipe name |
| `ingredient`      | `string` | recipe ingredients |
| `preparation`      | `string` | recipe preparation mode|
| `image_url`      | `string` | recipe image |
| `recipe_link`      | `string` | recipe link|
| `calories`      | `int` | recipe calories value |
| `dish_type`      | `int` | recipe dish type ENUM('Starter', 'Main dish', 'Dessert') |
| `diet_type`      | `int` | recipe diet type ENUM('Fish', 'Meat', 'Vegetarian', 'Vegan')|

#### Update recipe

```http
  PUT /register/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipe_name`      | `string` | recipe name |
| `ingredient`      | `string` | recipe ingredients |
| `preparation`      | `string` | recipe preparation mode|
| `image_url`      | `string` | recipe image |
| `recipe_link`      | `string` | recipe link|
| `calories`      | `int` | recipe calories value |
| `dish_type`      | `int` | recipe dish type ENUM('Starter', 'Main dish', 'Dessert') |
| `diet_type`      | `int` | recipe diet type ENUM('Fish', 'Meat', 'Vegetarian', 'Vegan')|

## Features

- Add a recipe to the database
- List all the stored recipes
- Update a certain recipe
- Delete a recipe
- web search, to search for a certain on the web, based on a name
## TIBCO processes

![project](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/project.png?raw=true)
![project shared resources](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/projectSharedREsources.png?raw=true)
![register service](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/registerrecipe.png?raw=true)
![search service](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/searchrecipe.png?raw=true)
![update service](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/updaterecipe.png?raw=true)
![delete service](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/deleterecipe.png?raw=true)
## Demo

# Main page
![project](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/mainpage.png?raw=true)

# register page
![project register page](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/register.png?raw=true)

# websearch page
![websearch result](https://github.com/edivaldolluisb/LynxRecipe/blob/main/screenshots/websearch.png?raw=true)
## Authors

- [@edivaldolluisb](https://github.com/edivaldolluisb)
