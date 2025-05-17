const cloudinary = require("cloudinary").v2;
const songsModel = require("../Model/song");

cloudinary.config({
  cloud_name: 'dxp3jrnum',
  api_key: '967442679762725',
  api_secret: 'jh8H6xFTASJw5Rq6tuSUiLQIzsU'
});

const addsongs = async (req, res) => {
  try {
    const { songTitle, songlabel } = req.body;

    // Check file presence
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // 👈 must match file type
      folder: "Songs"
    });

    const songTrack = result.secure_url;

    const data = await songsModel.create({
      songTitle,
      songlabel,
      songTrack
    });

    res.status(201).json({ success: true, message: "Song added", data });
  } catch (error) {
    console.error("🔥 Backend Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getallsongs = async (req, res) => {
  try {
    const songs = await songsModel.find();
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("❌ Error fetching songs:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
const deletesong = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await songsModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }
    res.status(200).json({ success: true, message: "Song deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting song:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addsongs, getallsongs, deletesong };
