const request = require("supertest");
const { app, mongoose, connectionPromise } = require("../setup");

describe("Item Endpoints", () => {
  let listId;
  let itemId;

  beforeAll(async () => {
    await connectionPromise;
    // Create a list to attach items to
    const createRes = await request(app)
      .post("/shoppingList/create")
      .set("x-profile", "owner")
      .send({ name: "Items List", owner: "user-1" });
    listId = createRes.body.data.id;
  });

  it("adds a new item", async () => {
    const res = await request(app)
      .post("/item/add")
      .set("x-profile", "member")
      .send({ name: "Milk", listId });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Milk");
    itemId = res.body.data.id;
  });

  it("fetches all items of the list", async () => {
    const res = await request(app)
      .get(`/item/list?listId=${listId}`)
      .set("x-profile", "member");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.find(i => i.id === itemId)).toBeTruthy();
  });

  it("updates an item", async () => {
    const res = await request(app)
      .put("/item/update")
      .set("x-profile", "member")
      .send({ id: itemId, name: "Updated Item" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("Updated Item");
  });

  it("deletes an item", async () => {
    const res = await request(app)
      .delete("/item/remove")
      .set("x-profile", "member")
      .send({ id: itemId });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.id).toBe(itemId);
  });

  afterAll(async () => {
    if (!global.__MONGOOSE_CLOSED__) {
      global.__MONGOOSE_CLOSED__ = true;
      await mongoose.connection.close();
    }
  });
});