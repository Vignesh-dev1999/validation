const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  registerValidation,
  registerValidationNew,
  registerValidationCustom,
  objectIdvalidation,
} = require("../components/validation");
const { result } = require("lodash");

exports.getAllUsers = async function (req, res) {
  let result = await UserModel.find();
  res.send(result);
};

exports.registerUser = async (req, res) => {
  const { userName, email, number, password } = req.body;

  // const validation =  registerValidation({userName, email, number, password})
  // if(validation) return res.send(validation)

  // const validation1 =  registerValidationNew({userName, email, number, password})
  // if(validation1) return res.send(validation1[0])

  const validation2 = registerValidationCustom({
    userName,
    email,
    number,
    password,
  });
  if (validation2) return res.status(400).send(validation2);

  let result = await UserModel.find({ $or: [{ email }, { number }] });
  if (result.length !== 0)
    return res.status(400).send({ message: "Email or Number already exist." });

  result = UserModel({
    userName: userName,
    email: email,
    number: number,
    password: password,
  });

  const errors = result.validateSync();
  if (errors) {
    return res.status(400).send(errors);
  }

  const salt = await bcrypt.genSalt(10);
  result.password = await bcrypt.hash(result.password, salt);

  result = await result.save();

  res.status(201).send({
    payload: "Inserted",
    message: "Payload inserted successfully.",
  });
};

exports.loginUser = async (req, res) => {
  if (req.body) return res.status(400).send("There is no data");
  const { email, number } = req.body;
  const user = await UserModel.findOne({
    $or: [{ email }, { number }],
  }).select({ userName: 1, email: 1, number: 1, password: 1 });
  if (!user)
    return res.status(500).send({
      payload: req.body,
      message: "User not found",
      error: "email or number might be worng.",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const result = {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    number: user.number,
  };

  res.send({
    response: result,
    message: "User found",
  });
};

exports.getUsersByFeilds = async (req, res) => {
  const { _id, userName, email, number, status } = req.body;
  const error = registerValidationCustom(
    { userName, email, number, password },
    true
  );
  if (error) return res.status(400).send(error);
  const result = await UserModel.find({
    $or: [{ _id }, { userName }, { email }, { number }, { status }],
  }).select(["-password", "-createdOn"]);
  res.send(result);
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  if (!objectIdvalidation(id))
    return res.status(400).send({
      message: "Invalid id.",
    });
  const { userName, email, number } = req.body;
  const error = registerValidationCustom({ userName, email, number }, true);
  if (error) return res.status(400).send(error);

  let result = await UserModel.find({ $or: [{ email }, { number }] });
  if (result.length !== 0)
    return res.status(400).send({ message: "Email or Number already exist." });

  result = await UserModel.findOne({ _id: id }).select([
    "userName",
    "email",
    "number",
  ]);
  if (userName) result.userName = userName;
  if (email) result.email = email;
  if (number) result.number = number;
  const response = await result.save();
  res.status(201).send({
    payload: response,
    message: "Updated Successfully",
  });
};

exports.deleteUsers = async (req, res) => {
  const id = req.params.id;
  if (!objectIdvalidation(id))
    return res.status(400).send({
      message: "Invalid id.",
    });
  const result = await UserModel.findByIdAndUpdate({ _id: id });
  if(!result) return res.status(400).send({
    message:""
  })
  result.status = "Inactive";
  await result.save();
  res.send({
    message: "User deleted.",
  });
};
