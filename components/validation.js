const Joi = require("joi");
const _ = require("lodash");
const Schema = require("validate");
const mongoose = require("mongoose")

module.exports.registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(4).max(15).required(),
    email: Joi.string().email().required(),
    number: Joi.string()
      .pattern(
        new RegExp(
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
        )
      )
      .required(),
    passwork: Joi.string()
      .pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
      )
      .required(),
  });
  return schema.validate(data);
};

module.exports.registerValidationNew = (data) => {
  const user = new Schema({
    username: {
      type: String,
      required: true,
      length: { min: 3, max: 32 },
    },
    email: {
      type: String,
      required: true,
      length: { min: 3, max: 32 },
    },
    number: {
      type: String,
      required: true,
      length: { min: 3, max: 32 },
    },

    password: {
      type: String,
      required: true,
      length: { min: 3, max: 32 },
    },
  });
  return user.validate(data);
};

module.exports.registerValidationCustom = (data, status) => {
  let validStatus = false;
  if (status) validStatus = status;
  const error = {};

  if (data.userName || validStatus) {
    let result = this.userNameValidation(data.userName);
    if (result) error.userName = result.userName;
  } else {
    error.userName = {
      message: "Username is reqired.",
    };
  }

  if (data.email || validStatus) {
    let result = this.emailValidation(data.email);
    if (result) error.email = result.email;
  } else {
    error.email = {
      message: "Email is reqired.",
    };
  }

  if (data.number || validStatus) {
    let result = this.numberValidation(data.number);
    if (result) error.number = result.number;
  } else {
    error.number = {
      message: "Number is reqired.",
    };
  }

  if (data.password || validStatus) {
    let result = this.passwordValidation(data.password);
    if (result) error.password = result.password;
  } else {
    error.password = {
      message: "Password is reqired.",
    };
  }
  if (!_.isEmpty(error)) return error;
};

exports.userNameValidation = (data) => {
  if (!data) return false;
  let error = {};
  if (typeof data == "string") {
    if (data.length >= 4) {
      if (data.length <= 15) {
        if (/^[a-zA-Z]+[0-9]*$/.test(data)) {
          error = undefined;
        } else {
          error.userName = {
            message: "Username is invalid.",
          };
        }
      } else {
        error.userName = {
          message: "Username is greater than 15 characters.",
        };
      }
    } else {
      error.userName = {
        message: "Username is less than 4 characters.",
      };
    }
  } else {
    error.userName = {
      message: "Username is not a string.",
    };
  }

  if (error) return error;
};

exports.passwordValidation = (data) => {
  if (!data) return false;
  let error = {};
  if (typeof data == "string") {
    if (data.length >= 8) {
      if (data.length <= 20) {
        if (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            data
          )
        ) {
          error = undefined;
        } else {
          error.password = {
            message:
              "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character.",
          };
        }
      } else {
        error.password = {
          message: "Password is greater than 20 characters.",
        };
      }
    } else {
      error.password = {
        message: "Password is less than 8 characters.",
      };
    }
  } else {
    error.password = {
      message: "Password is not a string.",
    };
  }
  if (error) return error;
};

exports.numberValidation = (data) => {
  if (!data) return false;
  let error = {};
  if (typeof data == "string") {
    if (data.length >= 10) {
      if (
        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
          data
        )
      ) {
        error = undefined;
      } else {
        error.number = {
          message: "Number is invalid.",
        };
      }
    } else {
      error.number = {
        message: "Number is less than 10 digits.",
      };
    }
  } else {
    error.number = {
      message: "Number is not a string.",
    };
  }
  if (error) return error;
};

exports.emailValidation = (data) => {
  if (!data) return false;
  let error = {};
  if (typeof data == "string") {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data)) {
      error = undefined;
    } else {
      error.email = {
        message: "Email is invalid.",
      };
    }
  } else {
    error.email = {
      message: "Email is not a string.",
    };
  }
  if (error) return error;
};

exports.objectIdvalidation =(data)=>{
  return mongoose.isValidObjectId(data)
}