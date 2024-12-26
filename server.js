const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser"); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());  
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  }
});
const upload = multer({ storage });


const db = mysql.createConnection({
  host: "localhost",
  user: "root",       
  password: "passwd",       
  database: "file_management"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected 已连接");
});


const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload file 上传文件接口
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files;

  files.forEach(file => {
    const filePath = path.join("uploads", file.filename);
    const sql = "INSERT INTO files (name, type, path) VALUES (?, ?, ?)";
    db.query(sql, [file.originalname, file.mimetype, filePath],(err) => {
      if (err) throw err;
    });
  });

  res.json({ message: "Folder uploaded successfully 文件上传成功", files });
});


// Get Document Information 获取文件信息接口
app.get("/files", (req, res) => {
    const sql = "SELECT id, name, type, path FROM files"; // 获取文件信息
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Failed to query file information 查询文件信息失败", err);
        return res.status(500).json({ message: "Inquiry Failure 查询失败" });
      }
      res.json(results);
    });
  });
 

// Uploading folders and files
app.post('/upload-folder', upload.array('files'), (req, res) => {
  const folderName = req.body.folderName;
  const folderPath = `uploads/${folderName}`;

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const folderSql = "INSERT INTO folders (name, path) VALUES (?, ?)";
  db.query(folderSql, [folderName, folderPath], (err, result) => {
    if (err) {
      console.error('Error inserting folder:', err);
      return res.status(500).send('Error inserting folder');
    }

    const folderId = result.insertId;

    req.files.forEach(file => {
      const destination = path.join(folderPath, file.originalname);
      fs.renameSync(file.path, destination);

      const fileSql = "INSERT INTO folder_files (name, type, path, folder_id) VALUES (?, ?, ?, ?)";
      db.query(fileSql, [file.originalname, file.mimetype, destination, folderId], (err) => {
        if (err) {
          console.error('Error inserting file:', err);
        }
      });
    });
    res.json({ message: "Folder uploaded successfully 文件夹上传成功" });
  });
});


// Get all folders获取所有文件夹
app.get('/folders', (req, res) => {
  const sql = "SELECT * FROM folders";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});



// Get a specific folder and its files 获取特定文件夹及其文件
app.get('/api/folder/:folderId', (req, res) => {
  const folderId = req.params.folderId;

  db.query('SELECT * FROM folders WHERE id = ?', [folderId], (err, folderResults) => {
    if (err) return res.status(500).send(err);
    if (folderResults.length === 0) return res.status(404).send('Folder not found');

    const folder = folderResults[0];

    db.query('SELECT * FROM folder_files WHERE folder_id = ?', [folderId], (err, fileResults) => {
      if (err) return res.status(500).send(err);
      res.json({
        folderName: folder.name,
        files: fileResults 
      });
    });
  });
});



// Delete File 删除文件接口
app.post("/delete", (req, res) => {
  const { ids } = req.body; 

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid File ID List 无效的文件 ID 列表" });
  }

  const selectSql = `SELECT path FROM files WHERE id IN (${ids.map(() => "?").join(",")})`;
  db.query(selectSql, ids, (err, results) => {
    if (err) {
      console.error("Failed to query file path 查询文件路径失败", err);
      return res.status(500).json({ message: "Document search failed 文件查询失败" });
    }

    const deleteSql = `DELETE FROM files WHERE id IN (${ids.map(() => "?").join(",")})`;
    db.query(deleteSql, ids, deleteErr => {
      if (deleteErr) {
        console.error("Deletion of database records fails 删除数据库记录失败", deleteErr);
        return res.status(500).json({ message: "Database Deletion Failed 数据库删除失败" });
      }

      results.forEach(file => {
        const filePath = path.join(__dirname, file.path);
        fs.unlink(filePath, unlinkErr => {
          if (unlinkErr) {
            console.error(`Failed to delete file 删除文件失败: ${filePath}`, unlinkErr);
          }
        });
      });

      res.json({ message: "File deleted successfully 文件删除成功" });
    });
  });
});
  


// Rename File 重命名文件接口
app.post("/rename", (req, res) => {
    const { id, newName } = req.body;
  
    if (!id || !newName) {
      return res.status(400).json({ message: "invalid parameter 无效的参数" });
    }
  
    const sql = "UPDATE files SET name = ? WHERE id = ?";
    db.query(sql, [newName, id], (err) => {
      if (err) {
        console.error("Failed to rename file 重命名文件失败", err);
        return res.status(500).json({ message: "Rename Failure 重命名失败" });
      }
  
      res.json({ message: "File renamed successfully 文件重命名成功" });
    });
  });
  
  


app.listen(port, () => {
  console.log(`The server runs on http://localhost:${port}`);
});




