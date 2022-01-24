const client = require("./es-wrapper.js");
const HttpError = require("./http-error");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);

class Task {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.priority = data.priority;
    this.creatorId = data.creatorId;
  }

  static async getByOffset(creatorId, offset) {
    try {
      const res = await client.search({
        index: "todolist",
        body: {
          query: {
            match: {
              creatorId,
            },
          },
        },
        from: offset * process.env.TASKS_PER_OFFSET,
        size: process.env.TASKS_PER_OFFSET,
      });
      const toDoList = [];
      res.body.hits.hits.map((task) => {
        toDoList.push({ id: task["_id"], ...task["_source"] });
      });
      return toDoList;
    } catch (error) {
      console.log("Error in /models/task getAll():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async getAll(creatorId) {
    try {
      const res = await client.search({
        index: "todolist",
        body: {
          query: {
            match: {
              creatorId,
            },
          },
        },
        size: 100,
      });
      const toDoList = [];
      res.body.hits.hits.map((task) => toDoList.push({ id: task["_id"], ...task["_source"] }));
      return toDoList;
    } catch (error) {
      console.log("Error in /models/task getAll():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async storeToList() {
    try {
      const res = await client.index({
        index: "todolist",
        type: "doc",
        body: {
          name: this.name,
          status: this.status,
          priority: this.priority,
          creatorId: this.creatorId,
        },
      });
      return res.body["_id"];
    } catch (error) {
      console.log("Error in /models/task storeToList():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async isExistedName() {
    try {
      const res = await client.search({
        index: "todolist",
        body: {
          query: {
            match: {
              name: this.name,
            },
          },
        },
      });
      for (let task of res.body.hits.hits) {
        if (task["_source"].name === this.name && task["_id"] != this.id) return true;
      }
      return false;
    } catch (error) {
      console.log("Error in /models/task isExistedName():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  async updateToList() {
    try {
      const res = await client.update({
        index: "todolist",
        type: "doc",
        id: this.id,
        body: {
          doc: {
            name: this.name,
            status: this.status,
            priority: this.priority,
          },
        },
      });
      return res.statusCode;
    } catch (error) {
      console.log("Error in /models/task updateToList():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async deleteFromList(id) {
    try {
      const res = await client.delete({
        index: "todolist",
        id: id,
        type: "doc",
      });
      return res.statusCode;
    } catch (error) {
      console.log("Error in /models/task deleteFromList():::", error);
      throw new HttpError("SERVER_INTERNAL_ERROR", 500);
    }
  }

  static async isIdExisted(id) {
    try {
      await client.get({
        index: "todolist",
        id: id,
        type: "doc",
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
