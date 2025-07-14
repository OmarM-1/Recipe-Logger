let currentUser = null;

function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  if (!username) {
    alert("Please enter a username.");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  currentUser = username;
  document.getElementById("login-container").style.display = "none";
  document.getElementById("app-container").style.display = "flex";
  showRecipes();
}

window.onload = function () {
  const storedUser = localStorage.getItem("loggedInUser");
  if (storedUser) {
    currentUser = storedUser;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app-container").style.display = "flex";
    showRecipes();
  }
};

function getUserKey() {
  return `recipes_${currentUser}`;
}

const nameInput = document.getElementById("recipe-name");
const ingredientsInput = document.getElementById("recipe-ingredients");
const instructionsInput = document.getElementById("recipe-instructions");
const recipeList = document.getElementById("recipe-list");

function addRecipe() {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value.trim();
  const instructions = instructionsInput.value.trim();

  if (!name || !ingredients || !instructions) {
    alert("Please fill in all fields.");
    return;
  }

  const recipe = { name, ingredients, instructions };
  let recipes = JSON.parse(localStorage.getItem(getUserKey())) || [];
  recipes.push(recipe);
  localStorage.setItem(getUserKey(), JSON.stringify(recipes));

  nameInput.value = "";
  ingredientsInput.value = "";
  instructionsInput.value = "";
  console.log("Saving to:", getUserKey());

  showRecipes();
}

function showRecipes() {
  recipeList.innerHTML = "";
  const recipes = JSON.parse(localStorage.getItem(getUserKey())) || [];

  recipes.forEach((recipe, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="recipe-name">${recipe.name}</span>
      <div class="recipe-actions">
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">❌</button>
      </div>
    `;

    li.querySelector(".recipe-name").onclick = (e) => {
      e.stopPropagation();
      alert(`🍽️ ${recipe.name}\n\n🥕 Ingredients:\n${recipe.ingredients}\n\n📋 Instructions:\n${recipe.instructions}`);
    };

    li.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      editRecipe(index);
    });

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteRecipe(index);
    });

    recipeList.appendChild(li);
  });
}

function deleteRecipe(index) {
  const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esta receta?");
  if (!confirmDelete) return;

  let recipes = JSON.parse(localStorage.getItem(getUserKey())) || [];
  recipes.splice(index, 1);
  localStorage.setItem(getUserKey(), JSON.stringify(recipes));
  showRecipes();
}

function editRecipe(index) {
  let recipes = JSON.parse(localStorage.getItem(getUserKey())) || [];
  const recipe = recipes[index];

  nameInput.value = recipe.name;
  ingredientsInput.value = recipe.ingredients;
  instructionsInput.value = recipe.instructions;

  const addBtn = document.querySelector("button[onclick='addRecipe()']");
  addBtn.textContent = "Update Recipe";
  addBtn.onclick = function () {
    recipe.name = nameInput.value.trim();
    recipe.ingredients = ingredientsInput.value.trim();
    recipe.instructions = instructionsInput.value.trim();

    if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
      alert("Please fill in all fields.");
      return;
    }

    recipes[index] = recipe;
    localStorage.setItem(getUserKey(), JSON.stringify(recipes));
    showRecipes();

    nameInput.value = "";
    ingredientsInput.value = "";
    instructionsInput.value = "";
    addBtn.textContent = "Add Recipe";
    addBtn.setAttribute("onclick", "addRecipe()");
  };
}

function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload(); // reload page to show login again
  }
  

// Init
window.onload = function () {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      currentUser = storedUser;
      document.getElementById("login-container").style.display = "none";
      document.getElementById("app-container").style.display = "flex";
      showRecipes(); // ✅ THIS is the correct place
    }
  };