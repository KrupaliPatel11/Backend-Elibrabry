// /**
//  * BookController
//  *
//  * @description :: Server-side actions for handling incoming requests.
//  * @help        :: See https://sailsjs.com/docs/concepts/actions
//  */

// // const fs = require('fs');
// const path = require('path');
// const uuid = require('uuid-random');
// // const multer = require('multer');


// // fs.readFile(pdfPath, function (err, data) {
// //     if (err) {
// //       return res.serverError(err);
// //     }
// //     res.set({
// //       "Content-Type": "application/pdf",
// //       "Content-Disposition": `attachment; filename="${pdfFilename}"`,
// //     });
// //     res.send(data);
// //   });


// // const pdfPath = path.resolve(__dirname, "../path/to/pdf/file.pdf");
// //   const pdfFilename = "file.pdf";

// module.exports = {

//     uploadBook: async function (req, res) {
//         const im = await req.file('image').upload({
//             maxBytes: 10 * 1024 * 1024, // Maximum file size (in bytes) for the image file
//             dirname: path.resolve(sails.config.appPath, 'public/images')
//         }, async function (err, files) {
//             if (err) return res.serverError(err);
//             const image = files[0];
//             console.log(image)
//             const imageUrl = image.fd;
//             console.log(imageUrl)

//             const document = await Book.create({
//                 id: uuid(),
//                 title: req.body.title,
//                 author: req.body.author,
//                 image: imageUrl
//             }).fetch();
//             await req.file('pdf').upload({
//                 maxTimeToBuffer: 10000,
//                 maxBytes: 10 * 1024 * 1024, // Maximum file size (in bytes) for the PDF file
//                 dirname: path.resolve(sails.config.appPath, 'public/pdfs')
//             }, async function (err, files) {
//                 if (err) return res.serverError(err);
//                 const pdf = files[0];
//                 if (!pdf) {
//                     return res.status(400).json({ success: true, msg: "No pdf Uploaded" })
//                 }
//                 const pdfUrl = pdf.fd;
//                 console.log(pdfUrl)
//                 await Book.update({ id: document.id })
//                     .set({ pdf: pdfUrl });
//                 await sails.helpers.nodemailer();
//                 return res.status(200).json({ success: true, msg: "Book Created" });
//             });
//         });
//     }
// };


/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// const fs = require('fs');
const path = require('path');
const uuid = require('uuid-random');
// const multer = require('multer');


// fs.readFile(pdfPath, function (err, data) {
//     if (err) {
//       return res.serverError(err);
//     }
//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${pdfFilename}"`,
//     });
//     res.send(data);
//   });


// const pdfPath = path.resolve(__dirname, "../path/to/pdf/file.pdf");
//   const pdfFilename = "file.pdf";

module.exports = {

    uploadBook: async function (req, res) {
            await req.file('pdf').upload({
                maxTimeToBuffer: 10000,
                maxBytes: 10 * 1024 * 1024, // Maximum file size (in bytes) for the PDF file
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
        }
    }

