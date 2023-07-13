const express = require("express");
const Container = require("./container");

const app = express();
app.use(express.json());
app.set("container", new Container());

app.get("/usuarios", async (request, response) => {
  const repository = await app.get("container").getRepositorio();
  const usuarios = await repository.findAll();
  response.json(usuarios);
});

app.post("/usuarios", async (request, response) => {
  const repository = await app.get("container").getRepositorio();
  const usuario = await repository.create(request.body);
  response.status(201).json(usuario);
});

app.get("/usuarios/:id", async (request, response) => {
  const repository = await app.get("container").getRepositorio();
  const usuario = await repository.findById(request.params.id);
  if (usuario === null) {
    response.status(404).json({
      status: 404,
      message: "Usuário não encontrado",
    });
  } else {
    response.json(usuario);
  }
});

app.put("/usuarios/:id", async (request, response) => {
  const repository = await app.get("container").getRepositorio();
  const usuario = await repository.findById(request.params.id);
  if (usuario === null) {
    response.status(404).json({
      status: 404,
      message: "Usuário não encontrado",
    });
  } else {
    const novoUsuario = { ...usuario, ...request.body };
    await repository.update(novoUsuario);
    response.json(novoUsuario);
  }
});

app.delete("/usuarios/:id", async (request, response) => {
  const repository = await app.get("container").getRepositorio();
  const usuario = await repository.findById(request.params.id);

  if (usuario !== null) {
    await repository.delete(usuario);
    response.status(204).send();
  } else {
    response.status(404).json({
      status: 404,
      message: "Usuário não encontrado",
    });
  }
});
module.exports = app;
