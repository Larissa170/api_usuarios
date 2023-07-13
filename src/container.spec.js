const Container = require("./container");
describe("Conexão", () => {
  let container;
  beforeEach(() => {
    container = new Container();
  });
  test("Deve criar uma conexão mongo", () => {
    const client = container.getConexao();
    expect(client).not.toBe(null);
    expect(client).not.toBe(undefined);
  });
  test("Deve retornar sempre a mesma instancia da conexão", () => {
    const clientA = container.getConexao();
    const clientB = container.getConexao();
    expect(clientA).toStrictEqual(clientB);
  });
  test("Deve criar um repositorio de usuarios", async () => {
    const repository = container.getRepositorio();
    expect(repository).not.toBe(null);
    expect(repository).not.toBe(undefined);
  });
});
