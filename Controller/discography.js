const cloudinary = require("cloudinary").v2;
const adminModel = require("../Model/admin");
const discographyModel = require("../Model/discography");

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxp3jrnum',
  api_key: '967442679762725',
  api_secret: 'jh8H6xFTASJw5Rq6tuSUiLQIzsU'
});

const addDiscography = async (req, res) => {
  try {
    const { songTitle } = req.body;
    console.log(req.body)

    

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'song_image',
    });

    const data = await discographyModel.create({
      songTitle,
      songimage: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Discography added",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add discography: " + error.message,
    });
  }
};
const getallDiscography = async (req, res) => {
  try {
    const discography = await discographyModel.find();
    res.status(200).json({ success: true, discography });
  } catch (error) {
    console.error("❌ Error fetching discography:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  addDiscography,
  getallDiscography
}