const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const TrainerModel = require("./Trainer");
const ImageModel = require("./Image");
const path = require("path");
const app = express();

const PORT = 3100;

const upload = multer();

mongoose
  .connect(
    "mongodb+srv://thangamlogeswaran21:Loges2108@cluster0.jgqqzge.mongodb.net/test"
  )
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.error(err));

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, disk) {
    return disk(null, "./images");
  },
  filename: function (req, file, save) {
    return save(null, `${file.originalname}`);
  },
});

const image = multer({ storage });

app.post("/createtrainers", image.single("avatar"), async (req, res, next) => {
  try {
    const imageName = req.file.filename;

    // Construct the full path to the image file
    const imagePath = path.join(__dirname, "images", imageName);

    const trainers = await TrainerModel.create({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
      avatar: req.file.filename,
    });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
});

app.get("/getavatars/:filename", async(req,res,next)=> {
  try {
    const imageName = req.params.filename;
    const imagePath = path.join(__dirname, "images",imageName)
    res.sendFile(imagePath)
  } catch (error) {
   next(error) 
  }
} )


app.get("/gettrainers", async (req, res, next) => {
  try {
    const gettrainers = await TrainerModel.find(req.params.id, {
      name: 1,
      age: 1,
      email: 1,
      phoneNumber: 1,
      gender: 1,
      avatar: 1,
    });
    res.json(gettrainers);
  } catch (error) {
    next(error);
  }
});

app.post("/createavatar", image.single("avatar"), async (req, res, next) => {
  const avatar = await ImageModel.create({
    filename: req.file.filename,
    originalname: req.file.originalname,
    data: req.file.buffer,
    contentType: req.file.mimetype,
  });
  res.json(avatar);
});

app.get("/getavatar", async (req, res, next) => {
  try {
    const image = await ImageModel.find();

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.setHeader("Content-Type", image.contentType);

    res.json(image);
  } catch (error) {
    next(error);
  }
});

app.put("/updatetrainer/:id", upload.none(), async (req, res, next) => {
  try {
    const updatetrainer = await TrainerModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
    });

    res.json(updatetrainer);
  } catch (error) {
    next(error);
  }
});

app.delete("/deletetrainer/:id", async (req, res) => {
  try {
    var result = await TrainerModel.deleteOne({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("server is running successfully");
  } else console.log("error occured", error);
});
