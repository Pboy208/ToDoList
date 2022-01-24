const express = require("express");
const router = express.Router();
const authsController = require("../controllers/auths");
const checkAuth = require("../middleware/check-auth");
//story7
router.post("/signup", authsController.signUp);

//story1
router.post("/login", authsController.login);

//story2
router.post("/renew", authsController.tokenRenew);

//check Token validation first
router.use(checkAuth);

//story3
router.post("", authsController.addAccount);

//story4
router.put("/:userId", authsController.changeAccoutnInfomation);

//story5
router.get("", authsController.getAllAccounts);

//story6
router.get("/:userId", authsController.getAccountInfoById);

module.exports = router;

/**
 * @swagger
 * components:
 *  schemas:
 *      Account:
 *          type: object
 *          required:
 *              - username
 *              - password
 *              - email
 *              - address
 *              - fullname
 *          properties:
 *              username:
 *                  type: string
 *                  description: The account username
 *              password:
 *                  type: string
 *                  description: The account password
 *              fullname:
 *                  type: string
 *                  description: User's full name
 *              email:
 *                  type: string
 *                  description: User's email
 *              address:
 *                  type: string
 *                  description: User's address
 *          example:
 *              username: TestingAcc
 *              password: TestingPass
 *              fullname: Testing Name
 *              email: testing@gmail.com
 *              address: Testing Address
 *      AccountModify:
 *          type: object
 *          required:
 *              - password
 *              - email
 *              - address
 *              - fullname
 *          properties:
 *              password:
 *                  type: string
 *                  description: The account password
 *              fullname:
 *                  type: string
 *                  description: User's full name
 *              email:
 *                  type: string
 *                  description: User's email
 *              address:
 *                  type: string
 *                  description: User's address
 *          example:
 *              password: TestingPw
 *              fullname: Testing Name
 *              email: testing@gmail.com
 *              address: Testing Address
 *      AccountInformation:
 *          type: object
 *          required:
 *              - userId
 *              - username
 *              - email
 *              - address
 *              - fullname
 *          properties:
 *              userId:
 *                  type: string
 *                  description: The account user id
 *              username:
 *                  type: string
 *                  description: The account username
 *              fullname:
 *                  type: string
 *                  description: User's full name
 *              email:
 *                  type: string
 *                  description: User's email
 *              address:
 *                  type: string
 *                  description: User's address
 *          example:
 *              userId: TestingUserId
 *              username: TestingAcc
 *              fullname: Testing Name
 *              email: testing@gmail.com
 *              address: Testing Address
 */

//User Story 1
/**
 * @swagger
 * /auths/login:
 *  post:
 *      summary: Validate account and receive back token
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: username of the account
 *                          password:
 *                              type: string
 *                              description: password of the account
 *                      example:
 *                          username: phuongnh32
 *                          password: Phuongkho1
 *      responses:
 *          200:
 *              description: A succesfull request
 *              content:
 *                  application/json:
 *                      type: object
 *                      properties:
 *                          token :
 *                              type: string
 *                              description : token for the login account
 *                      example:
 *                          token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBWHRTSWtINUE1NnBRSmZRTXpvWSIsImZ1bGxuYW1lIjoiTmd1eWVuIEhvYW5nIFBodW9uZyIsInVzZXJuYW1lIjoicGh1b25nbmgzMiIsImFkZHJlc3MiOiJIYW5vaSIsImVtYWlsIjoicGh1b25naG9hbmdAZ21haWwuY29tIiwiaWF0IjoxNjI5Njg0OTYyLCJleHAiOjE2Mjk2ODY3NjJ9.pneK36NpW-Jdb8xoIvtNMB4oJbGeeiUfDTdE0hjmaYo
 *          400:
 *              description: Wrong password or username / Invalid schema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: USER_INVALID_LOGININFO
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
 * /auths/review:
 *  post:
 *      summary: Get a new Token if the last one is not expired
 *      responses:
 *          200:
 *              description: New Token
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                                  description: Newly generated token
 *                          example:
 *                              token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBWHRTSWtINUE1NnBRSmZRTXpvWSIsImZ1bGxuYW1lIjoiTmd1eWVuIEhvYW5nIFBodW9uZyIsInVzZXJuYW1lIjoicGh1b25nbmgzMiIsImFkZHJlc3MiOiJIYW5vaSIsImVtYWlsIjoicGh1b25naG9hbmdAZ21haWwuY29tIiwiaWF0IjoxNjI5Njg0OTYyLCJleHAiOjE2Mjk2ODY3NjJ9.pneK36NpW-Jdb8xoIvtNMB4oJbGeeiUfDTdE0hjmaYo
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
 *                              message: TOKEN_INVALID
 */

//User Story 3
/**
 * @swagger
 * /auths:
 *  post:
 *      summary: Add a new account
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Account'
 *      responses:
 *          200:
 *              description: Task has been modified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of success
 *                          example:
 *                              message: Successfully
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
 *                              message: USER_INVALID_INPUT
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
 *                              message: Authorization failed
 *          403:
 *              description: UserId of the Token is not valid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: User Id not existed in the DB, Authorization failed
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
 *                              message: USER_EXISTED_USERNAME
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
 * /auths/{userId}:
 *  put:
 *      summary: Modify an account
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AccountModify'
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true;
 *          description: Id of account that user want to modify
 *          example: AXtSIkH5A56pQJfQMzoY
 *      responses:
 *          200:
 *              description: Task has been modified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of success
 *                          example:
 *                              message: Successfully
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
 *                              message: USER_INVALID_INPUT
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
 *                              message: Authorization failed
 *          403:
 *              description: UserId of the Token is not valid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: User Id not existed in the DB, Authorization failed
 *          404:
 *              description: UserId of the account is not existed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: USER_NOTFOUND
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

//User Story 5
/**
 * @swagger
 * /auths:
 *  get:
 *      summary: Get information of all accounts
 *      responses:
 *          200:
 *              description: Succesfully executed message
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/AccountInformation'
 *                          example:
 *                              data:
 *                                - id: TestingUserId
 *                                  username: TestingAcc
 *                                  fullname: Testing Name
 *                                  email: testing@gmail.com
 *                                  address: Testing Address
 *
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
 *                              message: Authorization failed
 *          403:
 *              description: UserId of the Token is not valid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: User Id not existed in the DB, Authorization failed
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

//User Story 6
/**
 * @swagger
 * /auths/{userId}:
 *  get:
 *      summary: Get information of a account with given User Id
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true;
 *          description: Id of account that user want to modify
 *          example: AXtSIkH5A56pQJfQMzoY
 *      responses:
 *          200:
 *              description: Task has been modified
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  description: account information
 *                          example:
 *                              data:
 *                                  id: TestingUserId
 *                                  username: TestingAcc
 *                                  fullname: Testing Name
 *                                  email: testing@gmail.com
 *                                  address: Testing Address
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
 *                              message: Authorization failed
 *          403:
 *              description: UserId of the Token is not valid
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: User Id not existed in the DB, Authorization failed
 *          404:
 *              description: UserId of the account is not existed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message of error
 *                          example:
 *                              message: USER_NOTFOUND
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
