const express = require("express");
const route = express.Router();
const {getAllUsers, registerUser , loginUser, getUsersByFeilds, updateUser, deleteUsers} = require("../services/userServices")

route.get("/", getAllUsers);
route.post("/register", registerUser);
route.post("/login", loginUser)
route.get("/getbyfeilds", getUsersByFeilds)
route.put("/update/:id", updateUser)
route.delete("/:id", deleteUsers)
module.exports = route;
