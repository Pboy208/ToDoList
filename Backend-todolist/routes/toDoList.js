const express = require("express");
const router = express.Router();
const toDoListController = require("../controllers/toDoList");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.get("/lazyloading/:offset", toDoListController.getListByOffset);

router.get("", toDoListController.getToDoList);

router.post("/add", toDoListController.addTaskToList);

router.put("/:taskId", toDoListController.changeTaskInList);

router.delete("/:taskId", toDoListController.deleteTaskFromList);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      Task:
 *          type: object
 *          required:
 *              - name
 *              - status
 *              - priority
 *          properties:
 *              name:
 *                  type: string
 *                  maxLength: 255
 *                  description: The name of the task
 *              status:
 *                  type: string
 *                  enum:
 *                      - OPEN
 *                      - IN PROGRESS
 *                      - DONE
 *                  description: The status of the task, can either be OPEN or IN PROGRESS or DONE
 *              priority:
 *                  type: string
 *                  enum:
 *                      - LOW
 *                      - MEDIUM
 *                      - HIGH
 *                  description: The priority of the task
 *          example:
 *              name: Finish adding document
 *              status: DONE
 *              priority: HIGH
 */

//User Story 1
/**
 * @swagger
 * /todolist:
 *  get:
 *      summary: Use to get a list of all tasks
 *      responses:
 *          200:
 *              description: A succesfull request
 *              content:
 *                  application/json:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Task'
 *          500:
 *              description: Sever internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: SERVER_INTERNAL_ERROR
 */

//User Story 2
/**
 * @swagger
 * /todolist/add:
 *  post:
 *      summary: Add new task to the list
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          200:
 *              description: New task is created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: id of new added task
 *                          example:
 *                              id: AXs1P74hA56pQJfQMzoK
 *          400:
 *              description: Invalid format of input
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_INVALID_INPUT
 *          401:
 *              description: Invalid or expired token
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: AUTHORIZATION_FAILED
 *          409:
 *              description: Existed name in database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_EXISTSED_NAME
 *          500:
 *              description: Sever internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: SERVER_INTERNAL_ERROR
 */

//User Story 3
/**
 * @swagger
 * /todolist/{taskId}:
 *  put:
 *      summary: Modify a task in the list
 *      parameters:
 *        - in: path
 *          name: taskId
 *          schema:
 *              type: string
 *          required: true;
 *          description: Id of task that user want to modify
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          200:
 *              description: Task has been modified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          400:
 *              description: Invalid format of input
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_INVALID_INPUT
 *          401:
 *              description: Invalid or expired token
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: AUTHORIZATION_FAILED
 *          404:
 *              description: None existed id in database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_NOT_EXISTS
 *          409:
 *              description: Existed name in database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_EXISTSED_NAME
 *          500:
 *              description: Sever internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: SERVER_INTERNAL_ERROR
 */

//User Story 4
/**
 * @swagger
 * /todolist/{taskId}:
 *  delete:
 *      summary: Delete a task from the list
 *      parameters:
 *        - in: path
 *          name: taskId
 *          schema:
 *              type: string
 *          required: true;
 *          description: Id of task that user want to delete
 *      responses:
 *          200:
 *              description: Task has been deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          401:
 *              description: Invalid or expired token
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: AUTHORIZATION_FAILED
 *          404:
 *              description: None existed id in database
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: TASK_NOT_EXISTS
 *          500:
 *              description: Sever internal error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: SERVER_INTERNAL_ERROR
 */
