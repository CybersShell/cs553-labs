import express, { json } from "express";

const handleServerErrors = (err, req, res, next) =>{
            if(err){
                if (err instanceof SyntaxError){

                    if(/JSON/i.test(err.message)){

                        res.status(400).json({ error: "Bad JSON format"})

                    } else{
                        res.status(500).json(err.message)
                    }
                    console.log(err.message)

                }
          }
          next(err);
    }

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];


  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/items", (req, res) => {
    res.json({ items });
  });
  
  app.get("/items/:id", (req, res) => {
    for (const item of items) {
      if (item.id == req.params.id) {
        res.json( item );
        return
      }
    }

    res.status(404).json({ error: `Item ID ${req.params.id} not found` });
  });

  app.post("/items", (req, res) => {
    const body = req.body;
    const nameInBody = "name" in body;
    const quantityInBody = "quantity" in body;
    if (quantityInBody) {
      if (isNaN(body.quantity)) {
        res.status(400).json({error: "Quantity field must be a number" })
        return
      }
      if (body.quantity < 0) {
        res.status(400).json({error: "Quantity must be greater than 0" })
        return
      }
    } else {
      res.status(400).json({error: "Missing 'quantity' field" })
      return
    }
    if (!nameInBody) {
      res.status(400).json({error: "Missing 'name' field" })
      return
    }
    const itemName = body.name;
    const itemQuantity = body.quantity;
    
    
    if (itemName.trim() === '') {
      res.status(400).json({error: "Name must be non-empty" })
      return
    }
    //? Should we check for existing name?
    // for (const element of items) {
      //   if (name === element.name) {
    //     res.status(400).json({error: `Item with ${name} exists` })
    //   }
    // }
    const newItem = {
      "id": nextId,
      "quantity": itemQuantity,
      "name": itemName,
    }
    
    items.push(newItem)
    res.status(201).json(newItem);
  });
  
  app.put("/items/:id", (req, res) => {
    const body = req.body;
    const isNameInBody = "name" in body;
    const isQuantityInBody = "quantity" in body;
    const nameInBody = req.body.name;
    const quantityInBody = req.body.quantity;
    
    if (isQuantityInBody) {
      if (isNaN(body.quantity)) {
        res.status(400).json({error: "Quantity must be a number" })
        return
      }
      if (body.quantity < 0) {
        res.status(400).json({error: "Quantity must be greater than 0" })
        return
      }
    } else {
      res.status(400).json({error: "Missing 'quantity' field" })
      return
    }
    if (!isNameInBody) {
      res.status(400).json({error: "Missing 'name' field" })
      return
    }
    
    for (const element of items) {
      if (req.params.id == element.id) {
        element.name = nameInBody
        element.quantity = quantityInBody
        res.status(200).json(element)
        return
      }
    }

    res.status(404).json({error: `Item with ${req.params.id} does not exist`})
  });
  
  app.delete("/items/:id", (req, res) => {

    var IsItemRemoved = false;

    items.forEach((item, index) => {
      if (item.id == req.params.id) {
        items.splice(index, 1)
        IsItemRemoved = true;
        var itemText = JSON.stringify(item);
        console.log(`Item ${itemText} Removed`)
      }
    })
    
    if (!IsItemRemoved) {
      res.status(404).json({error: `Item with ID ${req.params.id} does not exist`})
    }
    
    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use(handleServerErrors)

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
