// script.js

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function atualizarHistorico() {
  const historico = JSON.parse(localStorage.getItem("historico")) || [];
  const tabela = document.getElementById("tabela-historico");
  tabela.innerHTML = "";
  historico.forEach((item) => {
    const row = `<tr>
      <td>${item.nome}</td>
      <td>${item.cpf}</td>
      <td>${item.tamanho}</td>
      <td>${item.qtd}</td>
      <td>${item.retirada}</td>
    </tr>`;
    tabela.innerHTML += row;
  });
}

function mostrarMensagem(tipo, texto) {
  const div = document.getElementById("mensagem");
  div.className = `alert alert-${tipo}`;
  div.textContent = texto;
  div.classList.remove("d-none");
  setTimeout(() => div.classList.add("d-none"), 4000);
}

window.onload = atualizarHistorico;

document
  .getElementById("emprestimo-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const qtd = parseInt(document.getElementById("quantidade").value);
    const tamanho = document.getElementById("tamanho").value;
    const retirada = document.getElementById("retirada").value;

    if (!validarCPF(cpf)) {
      mostrarMensagem("danger", "❌ CPF inválido. Verifique os números.");
      return;
    }

    if (!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone)) {
      mostrarMensagem(
        "danger",
        "❌ Telefone inválido. Use o formato (xx) xxxxx-xxxx."
      );
      return;
    }

    if (qtd < 1 || qtd > 10) {
      mostrarMensagem(
        "danger",
        "❌ Quantidade deve estar entre 1 e 10 sacolas."
      );
      return;
    }

    const historico = JSON.parse(localStorage.getItem("historico")) || [];
    const cpfDuplicado = historico.some((item) => item.cpf === cpf);

    if (cpfDuplicado) {
      mostrarMensagem(
        "danger",
        "❌ Este CPF já possui um empréstimo registrado."
      );
      return;
    }

    const cliente = { nome, telefone, endereco, cpf, qtd, tamanho, retirada };
    historico.unshift(cliente);
    localStorage.setItem("historico", JSON.stringify(historico));
    atualizarHistorico();
    mostrarMensagem("success", "✅ Empréstimo registrado com sucesso!");
    e.target.reset();
  });
