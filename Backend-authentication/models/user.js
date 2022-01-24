const client = require("./es-wrapper.js");
const HttpError = require("./http-error");
const encryptByMd5 = require("md5");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);

class User {
  constructor(data) {
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.address = data.address;
    this.fullname = data.fullname;
    this.id = data.id;
  }

  async login() {
    try {
      const res = await client.search({
        index: "account",
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    username: this.username,
                  },
                },
                {
                  match: {
                    password: encryptByMd5(this.password),
                  },
                },
              ],
            },
          },
        },
      });

      if (res.body.hits.total !== 1) return false;
      this.id = res.body.hits.hits[0]["_id"];
      this.fullname = res.body.hits.hits[0]["_source"].fullname;
      this.address = res.body.hits.hits[0]["_source"].address;
      this.email = res.body.hits.hits[0]["_source"].email;
      return true;
    } catch (error) {
      console.log("Error in /models/user login():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async storeToDB() {
    try {
      const res = await client.index({
        index: "account",
        type: "doc",
        body: {
          username: this.username,
          password: encryptByMd5(this.password),
          email: this.email,
          fullname: this.fullname,
          address: this.address,
        },
      });
      return res.statusCode;
    } catch (error) {
      console.log("Error in /models/user storeToDB():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async updateAccountInformation() {
    try {
      const res = await client.update({
        index: "account",
        type: "doc",
        id: this.id,
        body: {
          doc: {
            username: this.username,
            password: encryptByMd5(this.password),
            email: this.email,
            fullname: this.fullname,
            address: this.address,
          },
        },
      });
      return res.statusCode;
    } catch (error) {
      console.log("Error in /models/user updateAccountInformation():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async getAll() {
    try {
      const res = await client.search({
        index: "account",
        body: {
          query: {
            match_all: {},
          },
        },
        size: 100,
      });
      const accountList = [];
      res.body.hits.hits.map((account) =>
        accountList.push({
          id: account["_id"],
          username: account["_source"].username,
          fullname: account["_source"].fullname,
          email: account["_source"].email,
          address: account["_source"].address,
        })
      );
      return accountList;
    } catch (error) {
      console.log("Error in /models/user getAll():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async getAccountInfoById(id) {
    try {
      const res = await client.get({
        index: "account",
        id: id,
        type: "doc",
      });
      return {
        id: res.body["_id"],
        username: res.body["_source"].username,
        email: res.body["_source"].email,
        fullname: res.body["_source"].fullname,
        address: res.body["_source"].address,
      };
    } catch (error) {
      console.log("Error in /models/user getAccountInfoById():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async isExistedUsername() {
    try {
      const res = await client.search({
        index: "account",
        body: {
          query: {
            match: {
              username: this.username,
            },
          },
        },
      });
      for (let account of res.body.hits.hits) {
        if (account["_source"].username === this.username && account["_id"] != this.id) return true;
      }
      return false;
    } catch (error) {
      console.log("Error in /models/user isExistedUsername():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async isIdExisted(id) {
    try {
      await client.get({
        index: "account",
        id: id,
        type: "doc",
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
