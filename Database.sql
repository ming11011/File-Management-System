CREATE DATABASE file_management;
USE file_management;

CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,   
  name VARCHAR(255) NOT NULL,           
  path VARCHAR(255) NOT NULL,          
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE folder_files (
  id INT AUTO_INCREMENT PRIMARY KEY,   
  name VARCHAR(255) NOT NULL,           
  type VARCHAR(100) NOT NULL,           
  path VARCHAR(255) NOT NULL,          
  folder_id INT,                        
  FOREIGN KEY (folder_id) REFERENCES folders(id) 
);

CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,    
  name VARCHAR(255) NOT NULL,            
  type VARCHAR(255) NOT NULL,           
  path VARCHAR(255) NOT NULL,           
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


SELECT * FROM folders;
SELECT * FROM folder_files;
SELECT * FROM files;

DROP DATABASE file_management;
