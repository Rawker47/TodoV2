// const port = 4000;
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const main = express();
// main.set("view engine", "ejs");
// main.use(express.static("public"));
// main.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// const items = ["play", "shopping", "coding"];
// const workList = [];

// main.get("/", (req, res) => {
//   res.render("index", { Title: "First Page", newListItem: items });
// });

// main.post("/", function (req, res) {
//   if (req.body.submitList === "First") {
//     console.log(req.body);
//     const item = req.body.newList;
//     items.push(item);

//     res.redirect("/");
//   } else {
//     console.log(req.body);
//     const item = req.body.newList;
//     workList.push(item);
//     res.redirect("/work");
//   }
// });

// main.get("/work", function (req, res) {
//   res.render("index", { Title: "work", newListItem: workList });
// });
// main.post("/work", function (req, res) {
//   const item = req.body.newList;
//   workList.push(item);
//   res.redirect("/work");
// });

// main.listen(4000, () => {
//   console.log(`Todo version 2 is listening on port : ${port}`);
// });

const port = 4000;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const main = express();
main.set("view engine", "ejs");
main.use(express.static("public"));
main.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const workList = [];

const itemSchema = {
  name: String,
};
const Item = mongoose.model("item", itemSchema);
const item1 = new Item({
  name: "First Item",
});
const item2 = new Item({
  name: "Second Item",
});
const item3 = new Item({
  name: "Third Item",
});
const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
  .then((resolove) => {
    console.log("Hippy ");
  })
  .catch((err) => {
    console.log("BOO! ");
  });

main.get("/", (req, res) => {
  res.render("index", { Title: "First Page", newListItem: defaultItems });
});

main.post("/", function (req, res) {
  const item = req.body.newList;
  if (req.body.item == "work") {
    workList.push(item);
    res.redirect("/work");
  } else {
    defaultItems.push(item);
    res.redirect("/");
  }
});

// main.get("/", function (req, res) {
//   Item.find({})
//     .then((foundItems) => {
//       if (foundItems.length === 0) {
//         Item.insertMany(defaultItems)
//           .then((docs) => {
//             console.log("Documents inserted successfully:", docs);
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//         res.redirect("/");
//       } else {
//         res.render("index", { Title: "Today", newListItems: foundItems });
//       }
//     })

//     .catch((err) => {
//       console.error(err);
//     });
// });
main.listen(4000, () => {
  console.log(`Todo version 2 is listening on port : ${port}`);
});
