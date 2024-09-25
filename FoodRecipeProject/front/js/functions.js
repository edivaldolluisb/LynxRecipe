//add all recipe forms fileds (input and text area) in the recipe_info form as readonly
export function makeFormReadOnly() {
    console.log("Form fields made read-only");
    const recipe_inputs = document.querySelectorAll(
        "#recipe_info input, #recipe_info textarea"
    );
    recipe_inputs.forEach((input) => {
        input.setAttribute("readonly", true);
    });
}

export function makeFormEditable() {
    const recipe_inputs = document.querySelectorAll(
        "#recipe_info input, #recipe_info textarea"
    );
    recipe_inputs.forEach((input) => {
        input.removeAttribute("readonly");
    });
}

//alert messages
export function showAlert(message, type = "info", duration = 3000) {
    const alertContainer = document.getElementById("alert-container");
    const alertBox = document.getElementById("alert");
    const alertMessage = document.getElementById("alert-message");

    // Configura o tipo de alerta e a mensagem
    alertBox.className = `alert ${type}`;
    alertMessage.textContent = message;

    // Exibe o alerta
    alertBox.style.opacity = "1";
    alertContainer.classList.remove("hidden");

    // Define um temporizador para esconder o alerta automaticamente após o tempo especificado
    setTimeout(() => {
        hideAlert();
    }, duration);
}

function hideAlert() {
    const alertBox = document.getElementById("alert");
    alertBox.style.opacity = "0"; // Transição suave
    setTimeout(() => {
        const alertContainer = document.getElementById("alert-container");
        alertContainer.classList.add("hidden");
    }, 300); // Duração da transição definida no CSS
}

// Evento para fechar o alerta ao clicar no botão de fechar
document.querySelector(".close-alert").addEventListener("click", hideAlert);

// Exemplo de uso
// document.addEventListener("DOMContentLoaded", () => {
//     showAlert("This is a success message!", "success", 5000); // Mostra um alerta de sucesso por 5 segundos
// });

// showAlert('Recipe added successfully!', 'success', 4000); // Alerta de sucesso
// showAlert('Failed to delete the recipe.', 'error'); // Alerta de erro
// showAlert('Make sure all fields are filled.', 'warning', 5000); // Alerta de aviso
// showAlert('Loading data...', 'info', 2000); // Alerta informativo

/*//////// search /////////// */

export async function searchRecipe(query, filter) {
    try {
        let response
        if (filter === 'web') {
            response = await fetch(
                `http://127.0.0.1:8000/websearch?q=${query}`
            );
        } else {
            response = await fetch(
            `http://127.0.0.1:8000/recipes?${filter}=${query}`
        );
        }

        const data = await response.json();
        console.log("Search results:", data);
        return data;
        // renderRecipesList(data.recipes.recipe);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

