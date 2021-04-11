const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.getUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send("User not found");
  }

  UserModel.findById(req.params.id, (err, data) => {
    if (!err) res.status(200).send(data);
    else res.status(500).send({ message: err });
  });
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send("User not found");
  }

  try {
    await UserModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      (err, data) => {
        if (!err) return res.status(200).send(data);
        else return res.status(500).json({ message: err });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send("User not found");
  }

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(203).json({ message: "User successfully deleted" });
  } catch (err) {}
};

module.exports.followUser = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    return res.status(404).send("User not found");
  }

  try {
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          following: req.body.idToFollow,
        },
      },
      {
        new: true,
        upsert: true,
      },
      (err, data) => {
        if (!err) res.status(201).json();
        else return res.status(500).json({ message: err });
      }
    );

    // add to follower list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: {
          followers: req.params.id,
        },
      },
      {
        new: true,
        upsert: true,
      },
      (err, data) => {
        if (err) return res.status(500).json({ message: err });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports.unfollowUser = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    return res.status(404).send("User not found");
  }

  try {
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          following: req.body.idToUnfollow,
        },
      },
      {
        new: true,
        upsert: true,
      },
      (err, data) => {
        if (!err) res.status(201).json();
        else return res.status(500).json({ message: err });
      }
    );

    // add to follower list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      {
        $pull: {
          followers: req.params.id,
        },
      },
      {
        new: true,
        upsert: true,
      },
      (err, data) => {
        if (err) return res.status(500).json({ message: err });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
