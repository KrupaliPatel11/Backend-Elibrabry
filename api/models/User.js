/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const {v4 : uuidv4} = require('uuid');

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
      isIn: Object.values(sails.config.enum.role),
      defaultsTo: sails.config.enum.role.USER,
    },
    token : {
      type : "string"
    }
  },

} 

