const amqp = require("amqplib");
const messageBroker = require("../../message_broker/rabbitmq");
const sinon = require("sinon");
require("dotenv").config();

const mockAssertQueue = jest.fn();
const mockSendToQueue = jest.fn();
const mockCreateChannel = async () =>
  Promise.resolve({
    assertQueue: mockAssertQueue,
    sendToQueue: mockSendToQueue,
  });
let sandbox;
describe("RabbitMQ testing", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
  test("Send message testing", async () => {
    sandbox
      .stub(amqp, "connect")
      .callsFake(async () => Promise.resolve({ createChannel: mockCreateChannel }));
    await messageBroker.send("FakeMessage");
    const expectedBuffer = Buffer.from(JSON.stringify("FakeMessage"));
    expect(mockAssertQueue).toBeCalledWith(process.env.QUEUE_NAME);
    expect(mockSendToQueue).toBeCalledWith(process.env.QUEUE_NAME, expectedBuffer);
  });

  test("Catch error testing", async () => {
    sandbox.stub(amqp, "connect").callsFake(async () => Promise.reject());
    try {
      await messageBroker.send("FakeMessage");
    } catch (error) {
      expect(error).toEqual(new Error("SERVER_INTERNAL_ERROR"));
    }
  });
});
