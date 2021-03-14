//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin-sondre:test123@cluster0.rsua0.mongodb.net/blogPage?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }
);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true],
  },
  content: {
    type: String,
    required: [true],
  },
});

const Post = mongoose.model("Post", postSchema);
let blogPosts = [];
let homeContent = [];
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Post.find((err, foundPosts) => {
    if (err) {
      console.log(err);
    } else {
      blogPosts = foundPosts;
      console.log(foundPosts);
      res.render("home", {
        homeStartingContent: homeStartingContent,
        homeContent: foundPosts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new Post({ title: req.body.title, content: req.body.newPost });
  post.save();
  res.redirect("/");
});

app.get("/posts/:input", (req, res) => {
  const searchParameter = req.params.input;
  console.log(searchParameter);
  Post.findOne({ _id: searchParameter }, (err, post) => {
    if (post) {
      console.log(post);
      res.render("post", {
        postTitle: post.title,
        postContent: post.content,
      });
    } else {
      console.log("No match");
      res.render("post", {
        postTitle: "404, Not found",
        postContent: "Blog post does not exist",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
