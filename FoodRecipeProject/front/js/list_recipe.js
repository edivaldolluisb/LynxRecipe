import {
    makeFormReadOnly,
    makeFormEditable,
    showAlert,
    searchRecipe,
} from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes();

    // Capturar "Enter" e acionar a ação correta
    document.querySelector("#recipe_info").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevenir o comportamento padrão de submit

                const updateButton = document.querySelector("#update_button");
                const registerButton =
                    document.querySelector("#register_button");

                // Se o botão de atualizar estiver visível, acionar a atualização
                if (updateButton.style.display === "flex") {
                    updateButton.click();
                }
                // Se o botão de registrar estiver visível, acionar o registro
                else if (registerButton.style.display === "flex") {
                    registerButton.click();
                }
            }
        });
});

async function fetchRecipes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/recipes");
        const data = await response.json();
        if(data?.recipes){
            renderRecipesList(data.recipes.recipe);
        }
        else{
            showAlert('Error searching for recipes.', 'error'); // Alerta de erro
            showAlert(data.message.msg, 'info', 2000); // Alerta informativo
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

function renderRecipesList(recipes) {
    const recipesList = document.getElementById("recipes_list");
    let recipesHTML = "";

    recipes.forEach((recipe) => {
        recipesHTML += `
            <div class="recipe">
                <div class="recipe_image">
                    <span>${recipe.recipe_number}</span>
                    <img src="${
                        isValidURL(recipe.image_url) ? 
                        recipe.image_url : "../images/charlesdeluvio.jpg"
                    }" alt="${recipe.recipe_name}">
                </div>
                <h2>${recipe.recipe_name}</h2>
                    <div class="recipe_details">
                        <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> 
                        ${recipe.calories}</span>
                        <span>${recipe.dish_type}</span>
                        <span>${recipe.diet_type}</span>
                    </div>
                <button type="button" class="open_recipe" data-recipe-id="${
                    recipe.recipe_number
                }">
                    See recipe
                </button>
            </div>
        `;
    });

    recipesList.innerHTML = recipesHTML;

    const openRecipeButtons = document.querySelectorAll(".open_recipe");
    openRecipeButtons.forEach((button) => {
        button.addEventListener("click", handleOpenRecipeClick);
    });
}
function renderRecipesWebList(recipes) {
    // console.log("inside web render:", recipes);
    const recipesList = document.getElementById("recipes_list");
    let recipesHTML = "";

    recipes.recipe.forEach((recipe, index) => {
        recipesHTML += `
            <div class="recipe">
                <div class="recipe_image">
                    <img src="${
                        recipe.image || "./images/charlesdeluvio.jpg"
                    }" alt="food">
                </div>
                <h2>${recipe.title}</h2>
                <button class="register_web" data-recipe-id="${index}">
                    See recipe
                </button>
            </div>
        `;
    });

    recipesList.innerHTML = recipesHTML;

    const openRecipeButtons = document.querySelectorAll(".register_web");
    openRecipeButtons.forEach((button, index) => {
        button.setAttribute("data-recipe-id", index);
        button.addEventListener("click", handleOpenRecipewebClick);
    });
}

function handleOpenRecipeClick(event) {
    const button = event.currentTarget;
    const recipeId = button.getAttribute("data-recipe-id");

    // Show/hide buttons and form
    document.querySelector("#update_button").style.display = "flex";
    document.querySelector("#delete_button").style.display = "flex";
    const registerButton = document.querySelector("#register_button");
    const recipeImage = document.querySelector("#recipe_image");
    const seeRecipe = document.querySelector(".see_recipe");

    registerButton.style.display = "none";
    recipeImage.style.display = "block";
    seeRecipe.style.display = "flex";

    console.log("Recipe ID:", recipeId);

    makeFormReadOnly();
    getRecipeById(recipeId);

    // Add ID to delete and update buttons
    document
        .querySelector("#delete_button")
        .setAttribute("data-recipe-id", recipeId);
    document
        .querySelector("#update_button")
        .setAttribute("data-recipe-id", recipeId);
}
function handleOpenRecipewebClick(event) {
    // simulate click event to openAddRecipe button
    console.log('clicked on the webrecipe button');
    openAddRecipe.click();

    // get the index attribute of the button clicked
    const index = parseInt(event.target.getAttribute("data-recipe-id"));

    console.log("Recipe Posicion:", index);

    // get the value 'lastSearch' from local storage
    const lastSearch = localStorage.getItem("lastSearch");

    const searchData = JSON.parse(lastSearch);     // parse to JSON
    // get the recipe from the searchData array
    console.log("localStorage:", searchData);
    const recipe = searchData[index];
    console.log("web recipe:", recipe);

    document.querySelector("#recipe_name").value = recipe.title;
    document.querySelector("#recipe_ingredients").value = recipe.ingredients.ingredient[0]
    document.querySelector("#recipe_instructions").value = recipe.description
    document.querySelector("#recipe_image_url").value = recipe.image
    document.querySelector("#recipe_url").value = recipe.link

}

async function getRecipeById(recipeId) {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/recipes/${recipeId}`
        );
        const recipe = await response.json();

        if(recipe?.message){
            showAlert(recipe.message.msg, 'info', 2000); // Alerta informativo
        }

        //add recipe image
        document.querySelector("#recipe_image > img").src = isValidURL(recipe.image_url) 
        ? recipe.image_url : "../images/charlesdeluvio.jpg";

        // Update form fields
        const recipeName = document.querySelector("#recipe_name"),
        recipeIngredients = document.querySelector("#recipe_ingredients"),
        recipeInstructions = document.querySelector("#recipe_instructions"),
        recipeImage = document.querySelector("#recipe_image_url"),
        recipeLink = document.querySelector("#recipe_url"),
        recipeCalorie = document.querySelector("#recipe_calorie"),
        recipeDiet = document.querySelector("#selected-value")

        let dish_type = {"Starter":1, "Main dish":2, "Dessert":3};


        recipeName.value = recipe.recipe_name;
        recipeIngredients.value = recipe.ingredient;
        recipeInstructions.value = recipe.preparation;

        recipeImage.value = recipe.image_url;
        recipeLink.value = recipe.recipe_link;
        recipeCalorie.value = recipe.calories;

        dish_type = dish_type[recipe.dish_type];
        document.querySelector(`input[name="diet"][value="${dish_type}"]`).checked = true;

        recipeDiet.innerText = recipe.diet_type;
        document.querySelector(`input[name="category"][value="${recipe.diet_type}"]`).checked = true;
        
        console.log("Recipe fetched:", recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error);
    }
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

// Seleção de elementos
const closeSeeRecipe = document.querySelector(".close_see_recipe");
const seeRecipe = document.querySelector(".see_recipe");
const openAddRecipe = document.querySelector("#open_add_recipe");
const recipeForm = document.querySelector("#recipe_info");
const deleteButton = document.querySelector("#delete_button");
const updateButton = document.querySelector("#update_button");
const registerButton = document.getElementById("register_button");

const searchSubmit = document.querySelector("#search_submit");

// Funções utilitárias
const toggleDisplay = (element, displayStyle) => {
    element.style.display = displayStyle;
};

const resetForm = () => {
    recipeForm.reset();
};

const isValidURL = (str) => {
    try {
        new URL(str);
        return true;
    } catch (error) {
        return false;
    }
};

// Validar o formulário de receita
const validateForm = () => {
    const recipeName = document.querySelector("#recipe_name"),
    recipeImageUrl = document.querySelector("#recipe_image_url"),
    recipeUrl = document.querySelector("#recipe_url"),
    selectedValue = document.querySelector("#selected-value").innerText

    if (recipeName.value.trim() === "") {
        alert("Recipe name is required");
        return false;
    }
    if (
        recipeImageUrl.value.trim() !== "" &&
        !isValidURL(recipeImageUrl.value)
    ) {
        alert("Invalid image URL");
        return false;
    }
    if (recipeUrl.value.trim() !== "" && !isValidURL(recipeUrl.value)) {
        alert("Invalid URL");
        return false;
    }
    const diet_type = ["Fish", "Meat", "Vegetarian", "Vegan"];
    if (!diet_type.includes(selectedValue)) {
        alert("Invalid diet type, You must select a diet type");
        return false;
    }

    return true;
};

// Tornar formulário editável
// const makeFormEditable = () => {
//     document.querySelectorAll("#recipe_info input, #recipe_info textarea").forEach((input) => {
//         input.removeAttribute("readonly");
//     });
// };

// Obter dados da receita do formulário
const getRecipeData = () => {
    let diet = document.querySelector("#selected-value").innerText;
    const diet_type = {"Fish":1, "Meat":2, "Vegetarian":3, "Vegan":4};

    return {
        name: document.querySelector("#recipe_name").value,
        ingredients: document.querySelector("#recipe_ingredients").value,
        instructions: document.querySelector("#recipe_instructions").value,
        imageUrl: document.querySelector("#recipe_image_url").value,
        url: document.querySelector("#recipe_url").value,
        calories: document.querySelector("#recipe_calorie").value,
        diet_type: diet_type[diet],
        dish_type: document.querySelector('input[name="diet"]:checked').value,
    };
};

// Verificar se algum campo é editável
const checkEditableFields = () => {
    return Array.from(
        document.querySelectorAll("#recipe_info input, #recipe_info textarea")
    ).some((input) => !input.hasAttribute("readonly"));
};

// Lidar com eventos de interface do usuário
closeSeeRecipe.addEventListener("click", () =>
    toggleDisplay(seeRecipe, "none")
);

openAddRecipe.addEventListener("click", () => {
    toggleDisplay(document.querySelector("#recipe_image"), "none");
    toggleDisplay(document.querySelector("#update_button"), "none");
    toggleDisplay(document.querySelector("#delete_button"), "none");
    toggleDisplay(document.querySelector("#register_button"), "flex");

    resetForm();
    makeFormEditable(); 
    toggleDisplay(seeRecipe, "flex");
});

deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const recipeId = deleteButton.getAttribute("data-recipe-id");
    console.log("recipe id:", recipeId);
    const confirm_delete = confirm(
        "Are you sure you want to delete this recipe?"
    );
    if (confirm_delete) {
        await deleteRecipe(recipeId);
        //close form and refresh
        toggleDisplay(seeRecipe, "none");
        fetchRecipes();
    }
    // await deleteRecipe(recipeId);

    // //close form and refresh
    // toggleDisplay(seeRecipe, "none");
    // fetchRecipes();
    console.log("delete button clicked");
});

// Funções de API
const deleteRecipe = async (recipeId) => {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/recipes/${recipeId}`,
            { method: "DELETE" }
        );
        const data = await response.json();
        if (data.message.code == 200) {
            showAlert(data.message.msg, "success", 4000);
        } else {
            showAlert(data.message.msg, "error");
        }
        console.log("Deleting recipe:", data);
    } catch (error) {
        showAlert("Error deleting recipe", "error");

        console.error("Error deleting recipe:", error);
    }
};

// Atualizar receita
updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const recipeId = updateButton.getAttribute("data-recipe-id");

    if (!checkEditableFields()) {
        makeFormEditable();
        showAlert("The fields are now editable", "info", 2000);
        // alert("The fields are now editable");
    } else if (validateForm()) {
        const recipeData = getRecipeData();
        // console.log("recipe data:", recipeData);
        await updateRecipe(recipeId, recipeData);

        //close form and refresh
        toggleDisplay(seeRecipe, "none");
        fetchRecipes();
    }
});

const updateRecipe = async (
    recipeId,
    { name, ingredients, instructions, imageUrl, url, calories, dish_type, diet_type }
) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/update/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipe_name: name,
                ingredient: ingredients,
                preparation: instructions,
                image_url: imageUrl,
                recipe_link: url,
                recipe_number: recipeId,
                calories: Number(calories),
                dish_type: Number(dish_type),
                diet_type: Number(diet_type),
            }),
        });
        const data = await response.json();
        if (data.code === "200") {
            showAlert(data.msg, "success", 4000);
        } else {
            showAlert(data.msg, "error");
        }
        console.log("Updating recipe:", data);
    } catch (error) {
        showAlert("Error updating recipe:", "error");

        console.error("Error updating recipe:", error);
    }
};

// Registrar nova receita
registerButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const recipeData = getRecipeData();
        console.log("got recipe data:", recipeData);
        await registerRecipe(recipeData);
        //close form and refresh
        toggleDisplay(seeRecipe, "none");
        fetchRecipes();
    } else {
        console.log("Form not valid");
    }
});

const registerRecipe = async ({
    name,
    ingredients,
    instructions,
    imageUrl,
    url,
    calories,
    dish_type,
    diet_type,
    
}) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipe_name: name,
                ingredient: ingredients,
                preparation: instructions,
                image_url: imageUrl,
                recipe_link: url,
                calories: Number(calories),
                dish_type: Number(dish_type),
                diet_type: Number(diet_type),
            }),
        });
        const data = await response.json();
        if (data.message === "Recipe inserted") {
            showAlert(data.message, "success", 4000);
        } else {
            showAlert(data.message, "error");
        }

        console.log("Registering recipe:", data);
    } catch (error) {
        console.error("Error registering recipe:", error);
        showAlert("Error registering recipe", "error");
    }
};

searchSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    const searchTerm = document
        .querySelector("#search_field")
        .value.trim()
        .toLowerCase();
    const selectedOption = document.getElementById("filter").value;

    if (searchTerm) {

        if (selectedOption != 'web') {
            const response = await searchRecipe(searchTerm, selectedOption);
            console.log('Response:', response);
            if (response.recipes != null) {
                
            renderRecipesList(response.recipes.recipe);
            }
        } else {
            showAlert("searching...", 'info', 60000);
            const response = await searchRecipe(searchTerm, selectedOption);
            console.log('Response from web:', response);
            // if recipe?
            if (response.recipe) {
                /*add recipe to local storage*/
                localStorage.setItem('lastSearch', JSON.stringify(response.recipe));

                renderRecipesWebList(response);
            
                showAlert('Recipes found', 'success', 4000);
                console.log(response.recipe);
            } else {
                showAlert("No recipes found", "info");
            }
        }
    } else {
        showAlert("Please enter a search term", "error");
    }
});


// change #search_field type acording to selected option

document.getElementById("filter").addEventListener("change", (e) => {
    const searchField = document.querySelector("#search_field");
    if (e.target.value === "max_creation_date" || e.target.value === "min_creation_date") {
        searchField.type = "date";
    } else if (e.target.value === "max_recipe_number" || e.target.value === "min_recipe_number") {
        searchField.type = "number";
        searchField.min = 1;
    } else{
        searchField.type = "text";
    }
});