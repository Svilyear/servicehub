const fs = require("fs");

const database = require("./uploads");
const Product = require("./Product");
const Image = database.ProductImages;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "./uploads" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/resources/static/assets/tmp/" + ProductImage.name,
        image.data
      );

      return res.send(`File has been uploaded.`,Product);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
