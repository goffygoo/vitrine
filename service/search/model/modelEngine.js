import Ajv from "ajv";
import { addOrReplace, addOrUpdate, getDocumentById, searchQuery } from '../actions.js';

const ajv = new Ajv();

export default (schema, index) => {
  return class Model {
    static schema = schema;
    static index = index;

    static validateSchema(data) {
      const validate = ajv.compile(schema);
      const valid = validate(data);
      if (!valid) throw {
        message: "Invalid Schema",
        errors: validate.errors,
      };
    }

    static async findById(id) {
      return getDocumentById(id, this.index);
    }

    static async createOrReplaceOne(data) {
      this.validateSchema(data);
      return addOrReplace([data], this.index);
    }

    static async createOrUpdateOne(data) {
      return addOrUpdate([data], this.index);
    }

    static async searchQuery(query) {
      return searchQuery(query, this.index);
    }
  }
}
