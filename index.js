const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const v4= require("v4");
const multer = require("multer");
const app = express();

app.use(express.json());

app.use("/public/:filename", async (req, res, next) => {
    try {
        const { filename } = req.params;
        let { h, w, q, s, fit, bg } = req.query;

        if (h) {
            h = parseInt(h);
            if (h > 10000) {
                return res.status(400).json({ message: "height should be less than <10000" });
            }
        }


        if (w) {
            w = parseInt(w);
            if (w > 10000) {
                return res.status(400).json({ message: "width should be less than <10000" });
            }
        }


        if (s) {
            s = parseInt(s);
            if (s > 10000) {
                return res.status(400).json({ message: "size should be less than <10000" });
            }
        }


        if (q) {
            q = parseInt(q);
            if (q > 10000) {
                return res.status(400).json({ message: "quality should be less than <100" });
            }
        }

        res.setHeader("content-type", "image/jpg");
        const image = sharp(`./public/${filename}`).toFormat("jpg", {
            quality: q ? parseInt(q) : 60,
        })
        res.send(
            await image.resize(s,s).withMetadata().toBuffer()
        );



    } catch (error) {
        console.log(error);
        res.setHeader("content-type", "application/json");
        res.status(500).json({ message: "Internal server error" })
    }
})

app.get("/all-images", async(req, res, next)=>{
    const files= fs.readdirSync("./public")
    .map((file)=>({url : `http://localhost:5000/public/${file}`}));
    const response = files.length > 0 ? files : {
        message : "No images are found in your public directory, Navigate to /upload to upload images of your choice",
        url:"http://localhost:5000/upload",
    }
    res.json(response);
});

const uploadMiddlware = multer({
    limits: 1000000,
    storage: multer.diskStorage({
        destination: "./public",
        filename: function(req,res, cb){
        cb(null, v4() + path.extname(file.originalname));
        },
    }),
}).single("File");

app.post("/upload", uploadMiddlware, (req, res, next)=>{
    console.log(req.files);
    res.json({
        url:`http://localhost:5000/public/${req.file.filename}`,
        message:"file uploaded successfully",
    })
})

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
})