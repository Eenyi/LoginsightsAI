import React, { useEffect, useState } from 'react'
import "./admin.css"
import { useSelector } from "react-redux";
import apiRoutes from '../../resources/apiUrls';
import store, { setCurrentScreen, setLoggedUser } from '../../redux/store'
import logo from './../../images/logo.png'



export default function Admin() {
  const [fileName, setFileName] = useState("Drag and drop files here or click to upload");
  const currentScreen = useSelector((state) => state?.currentScreen);
  store.dispatch(setLoggedUser("Welcome! Dear, Admin"))
  const loggedUser = useSelector((state) => state?.loggedUser);
  const [fileDataArray, setFileDataArray] = useState([]);
  const [embeddingResponse, setEmbeddingResponse] = useState(null)
  useEffect(() => {
    const uploadWidget = document.querySelector('.upload-widget');
    const fileUpload = document.getElementById('file-upload');

    const handleFileUploadClick = () => {
      fileUpload.click();
    };

    const handleFileChange = (event) => {
      const files = event.target.files;
      const fileContentsDiv = document.getElementById('file-contents');
      fileContentsDiv.innerHTML = ''; // Clear previous contents

      const fileDataArrayTemp = [];

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const fileDiv = document.createElement('div');
          fileDiv.className = 'file-content';

          const fileMeta = document.createElement('div');
          fileMeta.textContent = `File Name: ${file.name}, File Size: ${file.size} bytes, File Type: ${file.type}`;
          setFileName(file?.name);
          console.info(fileMeta.textContent)
          const fileContent = document.createElement('pre');
          fileContent.textContent = e.target.result;

          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            content: e.target.result
          };
          fileDataArrayTemp.push(fileData);
        };
        reader.readAsText(file);
      });
      console.info("Test " + fileDataArrayTemp)
      setFileDataArray(fileDataArrayTemp);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      uploadWidget.style.borderColor = '#666';
    };

    const handleDragLeave = (event) => {
      uploadWidget.style.borderColor = '#ccc';
    };

    const handleDrop = (event) => {
      event.preventDefault();
      uploadWidget.style.borderColor = '#ccc';
      const files = event.dataTransfer.files;
      fileUpload.files = files; // This triggers the 'change' event
      fileUpload.dispatchEvent(new Event('change'));
    };

    uploadWidget.addEventListener('click', handleFileUploadClick);
    fileUpload.addEventListener('change', handleFileChange);
    uploadWidget.addEventListener('dragover', handleDragOver);
    uploadWidget.addEventListener('dragleave', handleDragLeave);
    uploadWidget.addEventListener('drop', handleDrop);

    return () => {
      uploadWidget.removeEventListener('click', handleFileUploadClick);
      fileUpload.removeEventListener('change', handleFileChange);
      uploadWidget.removeEventListener('dragover', handleDragOver);
      uploadWidget.removeEventListener('dragleave', handleDragLeave);
      uploadWidget.removeEventListener('drop', handleDrop);
    };
  }, []);

  const createEmbeddings = () => {
    setEmbeddingResponse("start")
    fetch(apiRoutes.CREATE_EMBEDDING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify(fileDataArray[0])
    })
      .then(response => response.json())
      .then(data => {
        setEmbeddingResponse("Embedding Created Successfully...")
      })
      .catch((error) => {
        console.error('Error:', error);
        setEmbeddingResponse("Embedding Failed")
      });
  };

  const handleClick = (value) => {
    store.dispatch(setCurrentScreen(value))          
  };
  return (
    <>
    <div className="dash">
        <div className="nav">
          <img src={logo} alt='...'/>
          <div className="wp-user">
              <div>{loggedUser}</div>
          </div>
          </div>
          <div className="sub-nav">
            <button onClick={() => handleClick('login')}>logout</button>
          </div>
        
    </div>

    <div className='margin-top-5-rem'>
      <section className="upload-section">
        <h1>Upload Your File</h1>
        <p>Accepted formats: .pdf</p>
        <div class="upload-widget">
          <input type="file" id="file-upload" multiple style={{ display: 'none' }} />
          <label >{fileName}</label>
        </div>
        <div id="file-contents"></div>
        <div className='wp-otr-home-button'>
          <button class="home-button" onClick={() => createEmbeddings()}>Create Embeddings</button>
        </div>
      </section>
      <section class="recommendations-section">
      { embeddingResponse === "start" ? 
      <div>
        <img src="/loading.gif" alt="Loading..." />
        <p>Loading...</p>
      </div>  : <p>{embeddingResponse}</p>
      }
      </section>
    </div>
    </>
  )
}
