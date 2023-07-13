const { MongoClient } = require("mongodb");
const UsuarioRepository = require("./repository");

class Container {
  services = {};
  getConexao() {
    if (this.services.client !== undefined) {
      return this.services.client;
    }
    const dns =
      "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
    const client = new MongoClient(dns);
    return (this.services.client = client);
  }
  async getRepositorio() {
    if (this.services.repository !== undefined) {
      return this.services.repository;
    }
    const client = this.getConexao();
    await client.connect();
    const collection = client.db("ap_db").collection("usuarios");
    return (this.services.repository = new UsuarioRepository(collection));
  }
}
module.exports = Container;
