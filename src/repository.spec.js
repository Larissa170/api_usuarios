const Container = require("./container");

describe("UsuarioRepositorio", () => {
  let client;
  let repository;
  //fazer a conexão antes de td
  beforeAll(async () => {
    const container = new Container();
    client = container.getConexao();
    repository = await container.getRepositorio();
  });
  //fechar a conexao depois de td
  afterAll(async () => {
    await client.close();
  });
  //limpa o repositorio dps de cada teste
  beforeEach(async () => {
    await repository.deleteAll();
  });

  test("Repositorio deve criar um usuario", async () => {
    const result = await repository.create({
      name: "Larissa",
      email: "larissa@email.com",
      password: "larissa123",
    });
    const usuarios = await repository.findAll();
    expect(usuarios.length).toBe(1);
  });

  test("Repositorio deve listar todos os usuários", async () => {
    await repository.create({
      name: "Larissa",
      email: "larissa@email.com",
      password: "larissa123",
    });
    const result = await repository.findAll();
    expect(result[0]).toStrictEqual(
      expect.objectContaining({
        name: "Larissa",
        email: "larissa@email.com",
        password: "larissa123",
      })
    );
  });

  test("Atualizar um usuário", async () => {
    const usuario = await repository.create({
      name: "Larissa",
      email: "larissa@email.com",
      password: "larissa123",
    });
    usuario.email = "larissa123@gmail.com";
    await repository.update(usuario);

    const result = await repository.findById(usuario._id);

    expect(result).toStrictEqual(
      expect.objectContaining({
        name: "Larissa",
        email: "larissa123@gmail.com",
        password: "larissa123",
      })
    );
  });
  test("Remover um usuário", async () => {
    const usuario = await repository.create({
      name: "Larissa",
      email: "larissa123@gmail.com",
      password: "larissa123",
    });
    await repository.delete(usuario);
    const usuarios = await repository.findAll();
    expect(usuarios.length).toBe(0);
  });
});
