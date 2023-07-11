const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  // try {
    const token = await req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, msg: "Missing Token!" });
    }
    const decoded = await jwt.verify(token, "krupali11");
    console.log("decoded",decoded)
    if (!decoded) {
      return res.status(403).json({ success: false, msg: "AUth Failed" });
    }
    req.userData = decoded;
    next();
  // } catch (error) {
  //   return await res.status(500).json({ success: false, msg: "Auth Failed by middlewere" });
  // }
};
