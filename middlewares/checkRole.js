const JWT = require('jsonwebtoken');

const { Employee } = require('../models');

const allowRoles = (role) => {
  // return a middleware
  return async (request, response, next) => {
    try {
      // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get('Authorization').replace('Bearer', '').trim();

    // DECODE TOKEN
    const payload = await JWT.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
      const employee = await Employee.findById(payload._id).select('-password').lean();

      if (
        employee
        // && employee.roles.includes(role)
        ) {
        return next();
      }

      return response.status(403).json({ message: 'Tài khoản không có quyền thao tác' }); // user is forbidden

    } catch (error) {
      console.log('««««« error »»»»»', error);
      response.status(403).json({ message: 'Forbidden' }); // user is forbidden
    }
  };
};

module.exports = allowRoles;