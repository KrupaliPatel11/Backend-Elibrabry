
/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path');
const uuid = require('uuid-random');
const fs = require('fs');

module.exports = {

    uploadBook: async function (req, res) {

        await req.file('pdf').upload({
            maxTimeToBuffer: 10000,
            maxBytes: 1 * 1024 * 1024,
            dirname: path.resolve(sails.config.appPath, 'public/pdfs')
        }, async function (err, files) {
            if (err) return res.serverError(err);
            const pdf = files[0];
            if (!pdf) {
                return res.status(400).json({ success: true, msg: "No pdf Uploaded" })
            }
            const pdfUrl = pdf.fd;
            console.log("pdfUrl", pdfUrl);
            const document = await Book.create({
                id: uuid(),
                title: req.body.title,
                author: req.body.author,
                pdf: pdfUrl
            }).fetch();
            console.log(document);
            if (!document) {
                return res.status(500).json({ success: false, msg: "Something Went Wrong" });
            }

            await req.file('image').upload({
                maxTimeToBuffer: 10000,
                maxBytes: 1 * 1024 * 1024,
                dirname: path.resolve(sails.config.appPath, 'public/images')
            }, async function (err, img) {
                const image = img[0];
                if (image) {
                    const imageUrl = image.fd;
                    console.log("imageUrl", imageUrl);
                    const book = await Book.update({ id: document.id }).set({ image: imageUrl });
                }
                await sails.helpers.nodemailer();
                return res.status(200).json({ success: true, msg: "Book Created" });
            })
        });
    },

    downloadBook: async (req, res) => {
        
        const id = req.params.id;
        // console.log(id);
        const book = await Book.findOne({ id: id }).exec(async (err, book) => {
            if (err) {
                return res.status(500).json({ success: false, msg: "Internal Server Error" });
            }
            if (!book) {
                return res.status(404).json({ success: false, msg: "Not Found" });
            }
            const filePath = await path.resolve(sails.config.appPath, 'public/pdfs', book.pdf);

            await fs.access(filePath, fs.constants.R_OK, (accessErr) => {
                if (accessErr) {
                    return res.status(500).json({ success: false, msg: "File Not Found" });
                }
            })
            if (!book.image) {
                return res.status(200).json({ success: true, filePath: filePath })
            }

            const imgPath = await path.resolve(sails.config.appPath, 'public/images', book.image);
            console.log(imgPath)
            await fs.access(imgPath, fs.constants.R_OK, (accessImgErr) => {
                if (accessImgErr) {
                    return res.status(500).json({ success: false, msg: "File Not Found" });
                }
            })
            return res.status(200).json({
                success: true,
                imgPath: imgPath,
                filePath: filePath
            })
        })
    },
};





