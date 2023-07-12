

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
            maxBytes: 1 * 1024 * 1024, // Maximum file size (in bytes) for the PDF file
            dirname: path.resolve(sails.config.appPath, 'public/pdfs')
        }, async function (err, files) {
            if (err) return res.serverError(err);
            const pdf = files[0];
            if (!pdf) {
                return res.status(400).json({ success: true, msg: "No pdf Uploaded" })
            }
            const pdfUrl = pdf.fd;
            console.log(pdfUrl)
            const document = await Book.create({
                id: uuid(),
                title: req.body.title,
                author: req.body.author,
                pdf: pdfUrl
            }).fetch();
            await sails.helpers.nodemailer();
            return res.status(200).json({ success: true, msg: "Book Created" });
        });
    },

    downloadBook: async (req, res) => {
        const bookId = req.params.id; // Assuming you have a book ID to identify the book
        console.log(bookId);
        const book = await Book.findOne({ id: bookId }).exec(async (err, book) => {
            if (err) {
                return res.status(500).json({ success: false, msg: "Internal Server Error" });
            }
            if (!book) {
                return res.status(404).json({ success: false, msg: "Book Not Found" });
            }
            const filePath = await path.resolve(sails.config.appPath, 'public/pdfs', book.pdf)
            fs.access(filePath, fs.constants.R_OK, (accessErr) => {
                if(accessErr) {
                    return res.status(500).json({success : false, msg : "File Not Found"})
                }
                return res.sendFile(filePath)
            })
        })
    },
};



