/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const {v4 : uuidv4} = require('uuid');

module.exports = {
  attributes: {
    // id : {
    //   type : "string",
    //   columnName : 'id',
    //   columnType : "uuid",
    //   required : true,
    //   unique : true,
    //   // defaultsTo : () => uuidv4()
    // },
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
  
// beforeCreate : function(values, proceed) {
//   values =  uuidv4();
//   return proceed();
// }
} 

