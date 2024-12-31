import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null,`${Date.now()}-${file.originalname}`)  // to prevent conflicts
    }
  })
  
const upload = multer({storage})


export default upload