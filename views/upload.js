const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' directory and subdirectories exist
const uploadDir = path.join(__dirname, 'uploads');
const subDirs = [
    'events', 
    'venue', 
    'culinary', 
    'entertainers', 
    'fun-activities', 
    'Beauty-decor', 
    'Automation', 
    'technicians', 
    'construction',
    'location' 
];

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

subDirs.forEach(dir => {
    const subDirPath = path.join(uploadDir, dir);
    if (!fs.existsSync(subDirPath)) {
        fs.mkdirSync(subDirPath, { recursive: true });
    }
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Sanitize folder input to prevent directory traversal attacks
        const folder = path.basename(req.body.folder || 'events'); // Default to 'events'
        const folderPath = path.join(uploadDir, folder);

        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
            try {
                fs.mkdirSync(folderPath, { recursive: true });
            } catch (err) {
                return cb(new Error('Failed to create upload directory'));
            }
        }

        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
