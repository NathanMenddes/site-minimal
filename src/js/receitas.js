function traduzirCategoria(categoria) {
  const categorias = {
    "Beef": "Carne bovina",
    "Chicken": "Frango",
    "Dessert": "Sobremesa",
    "Lamb": "Carneiro",
    "Pasta": "Massa",
    "Pork": "Porco",
    "Seafood": "Frutos do Mar",
    "Vegetarian": "Vegetariano"
  };
  return categorias[categoria] || categoria;
}

function traduzirArea(area) {
  const areas = {
    "American": "Americana",
    "British": "Britânica",
    "Canadian": "Canadense",
    "Chinese": "Chinesa",
    "French": "Francesa",
    "Greek": "Grega",
    "Indian": "Indiana",
    "Italian": "Italiana",
    "Japanese": "Japonesa",
    "Mexican": "Mexicana",
    "Moroccan": "Marroquina",
    "Spanish": "Espanhola",
    "Thai": "Tailandesa",
    "Turkish": "Turca"
  };
  return areas[area] || area;
}

async function buscarReceitas() {
  const termo = document.getElementById("inputBusca").value.trim();
  const container = document.getElementById("resultados");

  if (termo === "") {
    container.innerHTML = "<p>Digite o nome de uma receita.</p>";
    return;
  }

  container.innerHTML = "<p>Buscando receitas...</p>";

  try {
    const resposta = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termo}`);
    const dados = await resposta.json();
    const receitas = dados.meals;

    if (!receitas) {
      container.innerHTML = "<p>Nenhuma receita encontrada.</p>";
      return;
    }

    container.innerHTML = "";

    receitas.forEach(receita => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h2>${receita.strMeal}</h2>
        <img src="${receita.strMealThumb}" alt="${receita.strMeal}" />
        <p><strong>Categoria:</strong> ${traduzirCategoria(receita.strCategory)}</p>
        <p><strong>Origem:</strong> ${traduzirArea(receita.strArea)}</p>
        <p><strong>Instruções:</strong> ${receita.strInstructions.substring(0, 200)}...</p>
        <a href="${receita.strSource || '#'}" target="_blank">Ver receita completa</a>
      `;
      container.appendChild(div);
    });
  } catch (erro) {
    console.error("Erro:", erro);
    container.innerHTML = "<p>Erro ao buscar receitas.</p>";
  }
}
