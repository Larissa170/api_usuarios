const app = require("./api");
const Container = require("./container");
const request = require("supertest")(app);

describe("API CRUD Usuários", () => {
  let repository;
  let client;
  beforeAll(async () => {
    //conexão com banco usada para todos os testes
    const container = new Container();
    client = container.getConexao();
    repository = await container.getRepositorio();
  });
  afterAll(async () => {
    await client.close();
  });
  beforeEach(async () => {
    await repository.deleteAll();
  });
  //testes verbos HTTP
  test("GET/usuarios", async () => {
    await repository.create({
      name: "Luna",
      email: "Luna@email.com",
      password: "Luna123",
    });
    const response = await request
      .get("/usuarios")
      .expect("Content-type", /application\/json/);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toStrictEqual(
      expect.objectContaining({
        name: "Luna",
        email: "Luna@email.com",
        password: "Luna123",
      })
    );
  });
  test("POST/usuarios", async () => {
    const usuario = {
      name: "Luana",
      email: "Luana@email.com",
      password: "Luana123",
    };
    const response = await request.post("/usuarios").send(usuario);
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(expect.objectContaining(usuario));
  });
  // testes com paramentro de id
  //GET
  describe("GET/usuarios/:id", () => {
    test("Deve retornar 200 para usuario encontrado", async () => {
      const usuario = await repository.create({
        name: "Luna",
        email: "Luna@email.com",
        password: "Luna123",
      });
      const response = await request
        .get(`/usuarios/${usuario._id}`)
        .expect("Content-type", /application\/json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          name: "Luna",
          email: "Luna@email.com",
          password: "Luna123",
        })
      );
    });

    test("Deve retornar 404 para usuário não encontrado", async () => {
      const response = await request
        .get(`/usuarios/64b050adf182bdd6a3fdc9ef`)
        .expect("Content-type", /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 404,
        message: "Usuário não encontrado",
      });
    });
  });

  //PUT
  describe("PUT/usuarios/:id", () => {
    test("Deve retornar 200 para usuário encontrado", async () => {
      const usuario = await repository.create({
        name: "Luna",
        email: "Luna@email.com",
        password: "Luna123",
      });
      const response = await request
        .put(`/usuarios/${usuario._id}`)
        .send({
          name: "Luna",
          email: "Luna2023@gmail.com",
          password: "Luna12345",
        })
        .expect("Content-type", /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          name: "Luna",
          email: "Luna2023@gmail.com",
          password: "Luna12345",
        })
      );
      const novoUsuario = await repository.findById(usuario._id);
      expect(novoUsuario).toStrictEqual(
        expect.objectContaining({
          name: "Luna",
          email: "Luna2023@gmail.com",
          password: "Luna12345",
        })
      );
    });
    test("Deve retornar 404 para um usuario não encontrado", async () => {
      const response = await request
        .put("/usuarios/64b050adf182bdd6a3fdc9ef")
        .send({
          name: "Luna",
          email: "Luna2023@gmail.com",
          password: "Luna12345",
        })
        .expect("Content-type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 404,
        message: "Usuário não encontrado",
      });
    });

    //DELETE
    describe("DELETE/usuarios/:id", () => {
      test("Deve retornar 204 para usuário encontrado", async () => {
        const usuario = await repository.create({
          name: "Luna",
          email: "Luna@gmail.com",
          password: "Luna123",
        });

        const response = await request.delete(`/usuarios/${usuario._id}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toStrictEqual({});
        const novoUsuario = await repository.findById(usuario._id);
        expect(novoUsuario).toBe(null);
      });
      test("Deve retornar 404 para usuário não encontrado", async () => {
        const response = await request
          .delete("/usuarios/64b050adf182bdd6a3fdc9ef")
          .expect("Content-type", /application\/json/);
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({
          status: 404,
          message: "Usuário não encontrado",
        });
      });
    });
  });
});
