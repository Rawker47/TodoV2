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

const listSchema = {
  name: String,
  item: [itemSchema],
};

const List = mongoose.model("list", listSchema);

main.get("/", function (req, res) {
  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((docs) => {
            console.log("Documents inserted successfully:", docs);
          })
          .catch((error) => {
            console.error(error);
          });
        res.redirect("/");
      } else {
        res.render("index", { Title: "Today", newListItem: foundItems });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
main.get("/:dynamicRoute", (req, res) => {
  const dynamicRoutes = req.params.dynamicRoute;
  console.log("Dynamic route activated ", dynamicRoutes);

  List.findOne({ name: dynamicRoutes })
    .then((found) => {
      if (!found) {
        const list = new List({
          name: dynamicRoutes,
          item: defaultItems,
        });
        list.save();
      } else {
        res.render("index", {
          Title: found.name,
          newListItem: found.item,
        });
      }
    })
    .catch((error) => {
      console.log("Couldn't find Route ", error);
    });
});

main.post("/", function (req, res) {
  const itemName = req.body.newList;
  const listName = req.body.submitList;

  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((found) => {
        found.item.push(item);
        found.save();
        res.redirect("/" + listName);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
main.post("/delete", function (req, res) {
  const checkBoxId = req.body.checkboxName;
  const hiddenList = req.body.hiddenList;

  if (hiddenList === "Today") {
    Item.findByIdAndDelete(checkBoxId)
      .then((success) => {
        console.log("The item has been deleted ", success);
        res.redirect("/");
      })
      .catch((error) => {
        console.log("Sorry couldn't delete the item !");
      });
  } else {
    List.findOneAndUpdate(
      { name: hiddenList },
      { $pull: { item: { _id: checkBoxId } } }
    )
      .then((found) => {
        res.redirect("/" + hiddenList);
      })
      .catch((err) => {
        console.log("Error " + err);
      });
  }
});

main.listen(4000, () => {
  console.log(`Todo version 2 is listening on port : ${port}`);
});
