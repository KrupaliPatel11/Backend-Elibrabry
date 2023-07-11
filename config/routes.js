/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    "POST /admin/login": "UserController.adminLogin",
    "POST /admin/logout": "UserController.adminLogout",
    "POST /admin/book/upload": "BookController.uploadBook",

    "POST /user/signup": "UserController.userSignup",
    "POST /user/login": "UserController.userLogin",
    "POST /user/logout": "UserController.userLogout",
    "GET /user/books": "UserController.gelAllBook",
    "GET /user/book/:id": "UserController.getOneBook",

};
