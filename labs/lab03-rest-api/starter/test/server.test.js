import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Health returns OK", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("Test Items", () => {
  test("GET /items returns all items", async () => {
    const app = createApp();
    const items = [
      { id: 1, name: "keyboard", quantity: 10 },
      { id: 2, name: "mouse", quantity: 5 }
    ];
    const response = await request(app)
        .get("/items")
        .expect(200);

    expect(response.body).toEqual( { items } );
  });
  
  test("GET /items/:id returns the item by id", async () => {
    const app = createApp();
    const response = await request(app)
        .get("/items/1")
        .expect(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("quantity");
  });
  
  test("GET /items/:id returns 404 for non-existent  ID", async () => {
    const app = createApp();
    const response = await request(app)
    .get("/items/6")
    .expect(404);
  });
  
  test("POST /items creates the specified item", async () => {
    const app = createApp();
    const itemData = JSON.stringify({ "name": "tv", "quantity": 5})
    const response = await request(app)
    .post("/items")
    .send(itemData)
    .set("Content-Type", 'application/json')
    .set("Accept", 'application/json')
    .expect(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("quantity");
  });
  
  test("POST /items rejects missing quantity", async () => {
    const app = createApp();
    const itemData = JSON.stringify({ "name": "tv"})
    const response = await request(app)
        .post("/items")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(400);
    
        expect(response.body).toHaveProperty("error");        
    });
      
      test("POST /items rejects missing name", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": 5})
        const response = await request(app)
        .post("/items")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(400);
        expect(response.body).toHaveProperty("error");
       
      });
      
      test("POST /items rejects negative quantity", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": -5, "name": "tv"})
        const response = await request(app)
        .post("/items")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(400);
        expect(response.body).toHaveProperty("error");
      });
      
      test("POST /items rejects zero-length name", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": -5, "name": ""})
        const response = await request(app)
        .post("/items")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(400);
        expect(response.body).toHaveProperty("error");
      });

      test("PUT /items/:id updates item", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": 4, "name": "tv"})
        const response = await request(app)
        .put("/items/1")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(200);
      });
      
      test("PUT /items/:id rejects non-existent id", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": 4, "name": "tv"})
        const response = await request(app)
        .put("/items/4")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(404);
        expect(response.body).toHaveProperty("error");
      });

      test("PUT /items/:id rejects zero-length name", async () => {
        const app = createApp();
        const itemData = JSON.stringify({ "quantity": 4, "name": ""})
        const response = await request(app)
        .put("/items/4")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(404);
        expect(response.body).toHaveProperty("error");
      });

      test("PUT /items/:id rejects missing quantity", async () => {
        const app = createApp();
        const itemData = JSON.stringify({"name": "tv"})
        const response = await request(app)
        .put("/items/4")
        .send(itemData)
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(400);
        expect(response.body).toHaveProperty("error");
      });

      test("DELETE /items/:id deletes item", async () => {
        const app = createApp();
        var response = await request(app)
        .delete("/items/2")
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(204);

        response = await request(app)
        .get("/items/2")
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(404);
        expect(response.body).toHaveProperty("error");
      });

      test("DELETE /items/:id returns error for non-existent ID", async () => {
        const app = createApp();
        const response = await request(app)
        .delete("/items/84")
        .set("Content-Type", 'application/json')
        .set("Accept", 'application/json')
        .expect(404);
        expect(response.body).toHaveProperty("error");
      });
});