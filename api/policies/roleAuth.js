module.exports = async (req, res, next) => {

    const userRole = req.userData.role;

    console.log(userRole)

    if(userRole === sails.config.enum.role.ADMIN) {
        return next();
    } else {
        return res.status(403).json({success : false, msg : `Only admin can access this resource`});
    }
  };

