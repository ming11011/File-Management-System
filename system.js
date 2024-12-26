new Vue({
    el: "#app",
    data: {
      fileList: [], 
      layout: 'list', 
      showModal: false, 
      selectedFile: {}, 

      showRenameModalFlag: false,  
      newFileName: "", 

      filteredFiles: [], 
      searchQuery: "",

      folderList: [] ,
    },
  
    computed: {
      anySelected() {
        return this.fileList.some(file => file.selected);
      },
      selectedFileCount() {
        return this.fileList.filter(file => file.selected).length;
      },
      layoutClass() {
        return this.layout === 'list' ? 'list-layout' : 'grid-layout';
      },
      filteredFiles() {
        return this.fileList;
      }
      
    },
  
    methods: {
      async fetchFolderList() {
        try {
          const response = await axios.get('/api/folders');
          this.folderList = response.data;
        } catch (error) {
          console.error('Failed to load folder 加载文件夹失败:', error);
        }
      },
      mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const folderId = urlParams.get('id');
        console.log('Folder ID:', folderId); 
      
        if (folderId) {
          fetch(`http://127.0.0.1:3000/api/folder/${folderId}`)
            .then(response => {
              console.log('Response status:', response.status);
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Data received:', data);
              this.folderName = data.folderName;
              this.files = data.files;
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
        } else {
          console.error('Folder ID not provided in URL');
        }
      }      
      
      ,
      handleFolderUpload(event) {
        const files = event.target.files;
        if (!files.length) {
          console.error('No documents selected 未选择任何文件');
          return;
        }
      
        const folderName = files[0].webkitRelativePath.split('/')[0]; 
        
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append("files", file);
        });
        formData.append("folderName", folderName);
      
        axios.post('http://127.0.0.1:3000/upload-folder', formData)
          .then(() => {
            console.log('Folder uploaded successfully 文件夹上传成功');
            this.loadFolders(); 
          })
          .catch(err => {
            console.error("Folder upload failed 文件夹上传失败", err.response ? err.response.data : err.message);
          });
      },
      loadFolders() {
        axios.get('http://localhost:3000/folders')
          .then(response => {
            this.folderList = response.data;
          })
          .catch(err => {
            console.error("Failed to load folder 加载文件夹失败", err);
          });
      },
      openFolder(folder) {
        axios.get(`http://localhost:3000/folder/${folder.id}/files`)
          .then(response => {
            this.filteredFiles = response.data;
            this.currentFolder = folder.name;
          })
          .catch(err => {
            console.error("Failed to open folder 打开文件夹失败", err);
          });
      },
      

    // Toggle Layout Type
    toggleLayout(layoutType) {
      this.layout = layoutType;
    },

    isImage(file) {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      return imageTypes.includes(file.type);
    },

    handleItemClick(file) {
      this.selectedFile = file;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedFile = {}; 
    },

    // Example file loading
    created() {
      this.fileList = [
        {
          name: 'example.jpg',
          type: 'image/jpeg',
          url: 'https://via.placeholder.com/150',
          selected: false,
          lastModified: '2024-12-20 10:00',
        },
        {
          name: 'document.pdf',
          type: 'application/pdf',
          url: '',
          selected: false,
          lastModified: '2024-12-19 15:30',
        },
      ];
      this.filteredFiles = this.fileList; 
    },

    handleFileUpload(event) {
      const files = event.target.files;
      this.uploadFiles(files);
    },

    uploadFiles(files) {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      axios.post("http://localhost:3000/upload", formData)
        .then(() => {
          this.loadFiles();
        })
        .catch(err => {
          console.error("File upload failed 文件上传失败", err);
        });
    },
  

    // Filtering the file list
    filterFiles() {
      const query = this.searchQuery.toLowerCase();
      this.filteredFiles = this.fileList.filter(file =>
        file.name.toLowerCase().includes(query)
      );
    },

  loadFiles() {
    axios.get("http://localhost:3000/files")
      .then(response => {
        this.fileList = response.data.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          url: `http://localhost:3000/${file.path}`, 
          selected: false, 
          lastModified: new Date().toLocaleString() 
        }));
        this.filteredFiles = this.fileList;
      })
      .catch(err => {
        console.error("Failed to load file information 加载文件信息失败", err);
      });
    },

    // Delete selected files
    removeSelectedFiles() {
        const selectedFiles = this.fileList.filter(file => file.selected);
        const fileIds = selectedFiles.map(file => file.id);
       
        if (fileIds.length === 0) {
          console.error("No files selected for deletion");
          return;
        }
      
        axios.post("http://localhost:3000/delete", { ids: fileIds })
          .then(() => {
            this.loadFiles();
          })
          .catch(err => {
            console.error("Failed to delete file 删除文件失败", err);
          });
      },


      showRenameModal() {
        const selectedFiles = this.fileList.filter(file => file.selected);
        if (selectedFiles.length === 1) {
          this.selectedFile = selectedFiles[0];
          this.newFileName = this.selectedFile.name;  
          this.showRenameModalFlag = true;
        }
      },
  
      closeRenameModal() {
        this.showRenameModalFlag = false;
        this.newFileName = ""; 
      },
  
      renameFile() {
        if (!this.newFileName || this.newFileName === this.selectedFile.name) {
          return;
        }
  
        axios.post("http://localhost:3000/rename", {
          id: this.selectedFile.id,
          newName: this.newFileName
        })
        .then(() => {
          this.selectedFile.name = this.newFileName;  
          this.showRenameModalFlag = false;
          this.newFileName = "";  
        })
        .catch(err => {
          console.error("Failed to rename file 重命名文件失败", err);
        });
      },
    },

    created() {
      this.loadFiles();
      this.loadFolders();
    }
  });
  




const btnToTop = document.getElementById("btnToTop");

window.onscroll = function() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btnToTop.style.display = "block";  
  } else {
    btnToTop.style.display = "none"; 
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
