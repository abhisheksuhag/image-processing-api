const express = require("express");
const sharp = require("sharp");
const fs = require("fs");
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



const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`http://localhost:${port}`);
})