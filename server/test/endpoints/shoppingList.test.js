const request = require("supertest");
const { app, mongoose, connectionPromise } = require("../setup");

describe("Shopping List Endpoints", () => {
  let listId;

  it("creates a new shopping list", async () => {
    await connectionPromise; // ensure DB connected
    const res = await request(app)
      .post("/shoppingList/create")
      .set("x-profile", "owner")
      .send({ name: "Groceries", owner: "user-1" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.name).toBe("Groceries");
    listId = res.body.data.id;
  });

  it("lists all shopping lists", async () => {
    const res = await request(app)
      .get("/shoppingList/list")
      .set("x-profile", "owner");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.find(l => l.id === listId)).toBeTruthy();
  });

  it("fetches a single shopping list", async () => {
    const res = await request(app)
      .get(`/shoppingList/get?id=${listId}`)
      .set("x-profile", "owner");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.id).toBe(listId);
  });

  it("updates a shopping list", async () => {
    const res = await request(app)
      .put("/shoppingList/update")
      .set("x-profile", "owner")
      .send({ id: listId, name: "Updated List" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("Updated List");
  });

  it("deletes a shopping list", async () => {
    const res = await request(app)
      .delete("/shoppingList/delete")
      .set("x-profile", "owner")
      .send({ id: listId });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.id).toBe(listId);
  });

  afterAll(async () => {
    if (!global.__MONGOOSE_CLOSED__) {
      global.__MONGOOSE_CLOSED__ = true;
      await mongoose.connection.close();
    }
  });
});