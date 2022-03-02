import express from "express"
import mongoose from "mongoose"
const app = express()

//normal setup
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static("public"))

//mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB');

const Article = mongoose.model('Article', {
  title: "string",
  content: "string"
})

app.get("/articles", (req, res) => {
  Article.find({}, (err, articles) => {
    if (!err) res.send(articles)
    else res.send(err)

  })
})

app.post("/articles", (req, res) => {

  const {
    title,
    content
  } = req.body

  const article = new Article({
    title,
    content
  })
  article.save((err) => {
    if (!err) res.send("Success")
    else res.send(err)
  })
})

app.delete("/articles", (req, res) => {
  Article.deleteMany({}, err => {
    if (!err) res.send("success delete all")
    else res.send(err)
  })
})

app.route("/articles/:title")
  .get((req, res) => {
    const title = req.params.title
    Article.findOne({
      title
    }, (err, title) => {
      if (title) res.send(title)
      else res.send("No article found")
    })
  })
  .put((req, res) => {
    const titleToSearch = req.params.title
    const {
      title,
      content
    } = req.body
    Article.replaceOne({
      title: titleToSearch
    }, {
      title,
      content
    }, (err, resp) => {
      if (resp) res.send(resp)
      else res.send("could not overwrite article")
    })
  })
  .patch((req, res) => {
    const titleToSearch = req.params.title
    const object = req.body
    Article.updateOne({
      title: titleToSearch
    }, object, (err, resp) => {
      if (resp) res.send(resp)
      else res.send("patch fail")
    })
  })
  .delete((req, res) => {
    const titleToSearch = req.params.title
    Article.findOneAndDelete({
      title: titleToSearch
    }, (err, resp) => {
      if (resp) res.send("success delete")
      else res.send("no delete performed")
    })
  })

//port
app.listen(process.env.PORT || 3000, () => {
  console.log("server running at 3000")
})