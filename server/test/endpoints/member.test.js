const request = require("supertest");
const { app, mongoose, connectionPromise } = require("../setup");

describe("Member Endpoints", () => {
  let listId;
  const testUserId = "user-2";

  beforeAll(async () => {
    await connectionPromise;
    // Create a list as owner first
    const createRes = await request(app)
      .post("/shoppingList/create")
      .set("x-profile", "owner")
      .send({ name: "Members List", owner: "user-1" });
    listId = createRes.body.data.id;
  });

  it("adds a new member", async () => {
    const res = await request(app)
      .post("/member/add")
      .set("x-profile", "owner")
      .send({ listId, userId: testUserId, email: "user2@example.com", role: "member" });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.members.some(m => m.userId === testUserId)).toBe(true);
  });

  it("lists members of the list", async () => {
    const res = await request(app)
      .get(`/member/list?listId=${listId}`)
      .set("x-profile", "member");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.find(m => m.userId === testUserId)).toBeTruthy();
  });

  it("removes a member", async () => {
    const res = await request(app)
      .delete("/member/remove")
      .set("x-profile", "owner")
      .send({ listId, userId: testUserId });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.members.some(m => m.userId === testUserId)).toBe(false);
  });

  afterAll(async () => {
    if (!global.__MONGOOSE_CLOSED__) {
      global.__MONGOOSE_CLOSED__ = true;
      await mongoose.connection.close();
    }
  });
});