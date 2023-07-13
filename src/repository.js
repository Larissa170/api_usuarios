const mongo = require("mongodb");

class UsuarioRepository {
  collection;
  constructor(collection) {
    this.collection = collection;
  }

  async deleteAll() {
    await this.collection.deleteMany({});
  }
  async create(usuario) {
    await this.collection.insertOne(usuario);
    return usuario;
  }
  async findAll() {
    return (await this.collection.find({})).toArray();
  }
  async update(usuario) {
    await this.collection.updateOne({ _id: usuario._id }, { $set: usuario });
  }
  async findById(id) {
    return await this.collection.findOne({ _id: new mongo.ObjectId(id) });
  }
  async delete(usuario) {
    await this.collection.deleteOne({ _id: usuario._id });
  }
}
module.exports = UsuarioRepository;
