const accessModel = require("../models/accessModel");

const rateLimiting = async (req, res, next) => {
  const sid = req.session.id;

  try {
    //find if sid exist in accessDb or not
    const accessDb = await accessModel.findOne({ sessionId: sid });
    console.log(accessDb);

    //if not than create an entry, R1
    if (!accessDb) {
      const accessObj = new accessModel({
        sessionId: sid,
        lastReqTime: Date.now(),
      });

      await accessObj.save();
      next();
    }

    //R2-Rnth, compare the time R(n)-R(n-1)
    console.log((Date.now() - accessDb.lastReqTime) / (1000 * 60));

    const diff = (Date.now() - accessDb.lastReqTime) / (1000 * 60);

    //less then our login
    if (diff < 1) {
      return res.send({
        status: 400,
        message: "Too many request, please wait for some time.",
      });
    }

    await accessModel.findOneAndUpdate(
      { sessionId: sid },
      { lastReqTime: Date.now() }
    );

    next();
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = rateLimiting;

// 1970 ----------------------------->t1
//1970 -------------------------------------->t2
