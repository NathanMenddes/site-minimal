document.getElementById('formIMC').addEventListener('submit', function (e) {
  e.preventDefault();

  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);
  const resultadoDiv = document.getElementById('resultado');

  resultadoDiv.className = 'resultado'; // reset classes

  if (peso > 0 && altura > 0) {
    const imc = peso / (altura * altura);
    let classificacao = '';
    let dica = '';
    let classe = '';

    if (imc < 18.5) {
      classificacao = 'Abaixo do peso';
      dica = 'Considere conversar com um nutricionista para ganhar peso de forma saudável.';
      classe = 'abaixo';
    } else if (imc < 24.9) {
      classificacao = 'Peso normal';
      dica = 'Continue mantendo hábitos saudáveis!';
      classe = 'normal';
    } else if (imc < 29.9) {
      classificacao = 'Sobrepeso';
      dica = 'Procure adotar uma alimentação equilibrada e exercícios regulares.';
      classe = 'sobrepeso';
    } else {
      classificacao = 'Obesidade';
      dica = 'Busque apoio profissional para melhorar sua saúde.';
      classe = 'obesidade';
    }

    resultadoDiv.classList.add(classe);
    resultadoDiv.innerHTML = `
      Seu IMC é <strong>${imc.toFixed(2)}</strong> (${classificacao})<br>
      <small>${dica}</small><br>
      <a href="./chat-gpt.html" target="_blank" class="chat-link">
        <i class="bi bi-chat-dots"> </i> Dicas com o Brocolito 🥦
      </a>
    `;
  } else {
    resultadoDiv.textContent = 'Por favor, insira valores válidos.';
  }
});