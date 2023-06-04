const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: "AKIATRWTDP7N665Q5V5Y",
  secretAccessKey: "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",
  region: "eu-north-1",
});

const s3 = new AWS.S3();

//models
const Org = require("./models/org");
const File = require("./models/file");
const Admin = require("./models/admin");
const User = require("./models/user");
const { restart } = require("nodemon");

// Set up Express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Configure file upload using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/istem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware for org authentication
const authenticateOrg = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log("unathorize");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key");
    req.org = decoded.org;
    next();
  } catch (err) {
    // console.log("here");
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
  console.log("at authenticateAdmin");
  const token = req.headers.authorization;
  if (!token) {
    console.log("unathorize");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key");
    req.admin = decoded.admin;
    console.log("going next");
    next();
  } catch (err) {
    console.log("error");
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
  // console.log(req);
  const token = req.headers.authorization;
  console.log("token : ", token);
  if (!token) {
    console.log("unathorize");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("inside try block");
    const decoded = jwt.verify(token, "secret-key");
    req.user = decoded.user;
    next();
  } catch (err) {
    // console.log("here");
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Register a new org
app.post("/org/register", async (req, res) => {
  try {
    const { orgName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const org = new Org({ orgName, email, password: hashedPassword });
    await org.save();

    res.status(201).json({ message: "Org registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register a new Admin
app.post("/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Register a new User
app.post("/user/register", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not found" });
    }

    const filename = req.file.originalname;
    const fileData = req.file.buffer;
    const key = `${uuidv4()}-${filename}`;
    const params = {
      Bucket: "istem-bucket-public",
      Key: `certificates/${key}`,
      Body: fileData,
      ACL: "public-read",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.status(200).json({ message: "Certificate uploaded successfully" });
    });
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      s3_key: key,
    });
    await user.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Org login
app.post("/org/login", async (req, res) => {
  try {
    const { orgName, password } = req.body;

    const org = await Org.findOne({ orgName });
    if (!org) {
      return res.status(401).json({ message: "Org doesnt exist" });
    }

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ org: org._id }, "secret-key");
    // console.log(token);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Admin login
app.post("/admin/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(401).json({ message: "Admin doesnt exist" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ admin: admin._id }, "secret-key");
    // console.log(token);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//User login
app.post("/user/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "User doesnt exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ user: user._id }, "secret-key");
    // console.log(token);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// File upload
app.post(
  "/upload",
  authenticateOrg,
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const org = await Org.findById(req.org).exec();
      console.log(org);
      if (org.isApproved === false) {
        return res
          .status(401)
          .json({ message: "This org is not approved by admin" });
      }

      // console.log("still coming here");
      const filename = req.file.originalname;
      const fileData = req.file.buffer;
      const key = `${uuidv4()}-${filename}`;
      const params = {
        Bucket: "istem-bucket-public",
        Key: key,
        Body: fileData,
        ACL: "public-read",
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }

        res.status(200).json({ message: "File uploaded successfully" });
      });

      const file = new File({
        filename: filename,
        author: req.body.author,
        s3_key: key,
        language: req.body.language,
        owner: req.org,
        ownerName: org.orgName,
      });

      await file.save();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get all files
app.get("/files", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all files for a particular org
app.get("/files/org", authenticateOrg, async (req, res) => {
  try {
    const files = await File.find({ owner: req.org });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all orgs
app.get("/orgs", authenticateAdmin, async (req, res) => {
  try {
    const orgs = await Org.find();
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users
app.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find();
    // console.log(users);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve a org by id
app.get("/orgs/approve/:id", authenticateAdmin, async (req, res) => {
  Org.findByIdAndUpdate(
    req.params.id,
    {
      isApproved: true,
    },
    {
      new: true,
    }
  )
    .then((updatedOrg) => {
      console.log(updatedOrg);
      res.json(updatedOrg);
    })
    .catch((err) => {
      console.error(err);
    });
});

// Approve an user by id
app.get("/users/approve/:id", authenticateAdmin, async (req, res) => {
  console.log("comming here to approve");
  User.findByIdAndUpdate(
    req.params.id,
    {
      isApproved: true,
    },
    {
      new: true,
    }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
    });
});

// View a given user's certificate
app.get("/user/certificate/:id", authenticateAdmin, async (req, res) => {
  console.log("ariving at this route");
  try {
    const user = await User.findById(req.params.id);

    const s3_key = `certificates/${user.s3_key}`;

    let downloadFolder;
    switch (os.platform()) {
      case "win32":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      case "darwin":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      case "linux":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      default:
        console.error("Unsupported operating system");
        return;
    }

    const params = {
      Bucket: "istem-bucket-public",
      Key: s3_key,
    };

    const destinationPath = path.join(
      downloadFolder,
      `${uuidv4()}-${user.name}.pdf`
    );

    const downloadedFile = require("fs").createWriteStream(destinationPath);

    s3.getObject(params)
      .createReadStream()
      .on("error", (err) => {
        console.error("Failed to download file from S3:", err);
        callback(err);
      })
      .pipe(downloadedFile)
      .on("finish", () => {
        console.log("File downloaded from S3");
        res.set({
          "Content-Disposition": `attachment; filename=${encodeURIComponent(
            user.name
          )}`,
          "Content-Type": "application/octet-stream",
        });

        // callback(null, destinationPath);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific file
app.get("/files/:id", authenticateUser, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get files from query
app.post("/files/search", authenticateUser, async (req, res) => {
  const searchQuery = req.body.searchQuery;

  const user = await User.findById(req.user).exec();
  console.log("user: ", user);
  if (user.isApproved === false) {
    console.log("isApproved is false");
    return res
      .status(401)
      .json({ message: "This org is not approved by admin" });
  }
  console.log("still coming here");
  try {
    const searchResult = await File.find({
      filename: { $regex: new RegExp(searchQuery, "i") },
    });

    console.log(searchResult);
    res.json(searchResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//download specific file
app.get("/download/files/:id", authenticateUser, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    const s3_key = file.s3_key;

    let downloadFolder;
    switch (os.platform()) {
      case "win32":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      case "darwin":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      case "linux":
        downloadFolder = path.join(os.homedir(), "Downloads");
        break;
      default:
        console.error("Unsupported operating system");
        return;
    }

    const params = {
      Bucket: "istem-bucket-public",
      Key: s3_key,
    };

    const destinationPath = path.join(
      downloadFolder,
      `${uuidv4()}-${file.filename}`
    );

    const downloadedFile = require("fs").createWriteStream(destinationPath);

    console.log("os: ", os.platform());
    console.log("homedir: ", os.homedir());
    console.log("donwloadedFolder: ", downloadFolder);

    s3.getObject(params)
      .createReadStream()
      .on("error", (err) => {
        console.error("Failed to download file from S3:", err);
        callback(err);
      })
      .pipe(downloadedFile)
      .on("finish", () => {
        console.log("File downloaded from S3");
        var downloads = file.downloads;
        File.findByIdAndUpdate(
          file._id,
          { downloads: downloads + 1 },
          { new: true }
        )
          .then((updatedFile) => {
            console.log(updatedFile);
          })
          .catch((error) => {
            console.error(error);
          });

        res.set({
          "Content-Disposition": `attachment; filename=${encodeURIComponent(
            file.filename
          )}`,
          "Content-Type": "application/octet-stream",
        });

        // callback(null, destinationPath);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a file
app.put("/files/:id", authenticateUser, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    file.filename = req.body.filename || file.filename;
    await file.save();

    res.json({ message: "File updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a file
app.delete("/files/:id", authenticateUser, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.owner.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await file.remove();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a specifc admin
app.get("/admin", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a specific user
app.get("/user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a specific org
app.get("/org", authenticateOrg, async (req, res) => {
  try {
    const org = await Org.findById(req.org);
    if (!org) {
      return res.status(404).json({ message: "Org not found" });
    }

    res.json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
