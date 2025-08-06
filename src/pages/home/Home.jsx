import React, { useEffect, useState } from 'react'
import "./home.css"
import { useSelector } from "react-redux";
import store, { setCurrentScreen, setLoggedUser } from '../../redux/store'
import apiRoutes from '../../resources/apiUrls';
import Fetch from '../../resources/fetch'
import ReactMarkdown from 'react-markdown';
import logo from './../../images/logo.png'



export default function Home() {
  const currentScreen = useSelector((state) => state?.currentScreen);
  store.dispatch(setLoggedUser("Dear, Investigator"))
  const loggedUser = useSelector((state) => state?.loggedUser);
  const [fileDataArray, setFileDataArray] = useState([]);
  const [sections, setSections] = useState([]);
  const [graphList, setGraphList] = useState([]);
  const [loadData, setLoadData] = useState(null);
  // const [imageDatalist, setImageDataList] = useState([]);
  const [fileName, setFileName] = useState("Drag and drop files here or click to upload");
  const [graph1, setGraph1] = useState(null);
  const [graph2, setGraph2] = useState(null);
  const [graph3, setGraph3] = useState(null);

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

  // useEffect(() => {
  //   if (imageDatalist.length > 1) {
  //     getGraphList();
  //   }
  // }, [imageDatalist]);

  useEffect(() => {
    if (graphList.length > 2) {
      setLoadData(true);
    }
  }, [graphList]);

  const getGraph1 = async (imageData) => {
    const response = await Fetch(apiRoutes.GRAPH, "post", JSON.stringify(imageData), "json", "blob");
    setGraph1(URL.createObjectURL(response));
  }

  const getGraph2 = async (imageData) => {
    const response = await Fetch(apiRoutes.GRAPH, "post", JSON.stringify(imageData), "json", "blob");
    setGraph2(URL.createObjectURL(response));
  }

  const getGraph3 = async (imageData) => {
    const response = await Fetch(apiRoutes.GRAPH, "post", JSON.stringify(imageData), "json", "blob");
    setGraph3(URL.createObjectURL(response));
    setLoadData(true);
  }

  const getGraphList = () => {
    try {
      // Array.from(imageDatalist).forEach(async imageData => {
      //   const response = await Fetch(apiRoutes.GRAPH, "post", JSON.stringify(imageData), "json", "blob");
      //   const url = URL.createObjectURL(response);
      //   graphList.push(url)
      //   setGraphList(graphList)
      //   if (graphList.length > 1) {
      //     setLoadData(true);
      //   }
      // })
    } catch (error) {
      console.error('Error fetching the graph:', error);
    }
  };

  const pieChartData = (graphNo, jsonStr) => {
    const cleanedStr = jsonStr.replace(/\\n/g, '').replace(/\\\"/g, '"').replace('```json', '').replace('```', '');
    let parsedData = JSON.parse(cleanedStr);

    const labels = [];
    const data = [];

    if(graphNo === 3 && parsedData && parsedData.requests) {
      parsedData = parsedData.requests
    }

    // Extract the keys and values
    for (const [key, value] of Object.entries(parsedData.interfaceIdCounts ? parsedData.interfaceIdCounts : parsedData)) {
      if (graphNo === 3) {
        labels.push(value.interfaceId);
        data.push(value.duration);
      }
      else {
        labels.push(key);
        data.push(value);
      }
    }

    return { labels, data };
  }
  
  const sendFileDataToBackend = () => {
    setLoadData(false)
    setGraphList([])
    setSections([])
    generateGraph_1();
    fetch(apiRoutes.UPLOAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify(fileDataArray[0])
    })
      .then(response => response.json())
      .then(data => {
        const sections = data.response.response;
        let splitSections = sections.split('## ').filter(section => section.trim());
        splitSections = splitSections.map(item => '## ' + item);
        setSections(splitSections);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const generateGraph_1 = () => {
    console.log(fileDataArray)
    fetch(apiRoutes.GRAPH_DATA_1, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify(fileDataArray[0])
    })
      .then(response => response.json())
      .then(data => {
        const chartData = pieChartData(1, data.response.response)
        getGraph1({
          data: chartData.data,
          labels: chartData.labels,
          title: "Transaction wise Count",
          graph_type: "pie"
        })
        generateGraph_2()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const generateGraph_2 = () => {
    fetch(apiRoutes.GRAPH_DATA_2, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify(fileDataArray[0])
    })
      .then(response => response.json())
      .then(data => {
        const chartData = pieChartData(1, data.response.response)
        getGraph2({
          data: chartData.data,
          labels: chartData.labels,
          title: "Status wise Transaction Count",
          graph_type: "pie"
        })
        generateGraph_3()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const generateGraph_3 = () => {
    fetch(apiRoutes.GRAPH_DATA_3, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify(fileDataArray[0])
    })
      .then(response => response.json())
      .then(data => {
        const chartData = pieChartData(3,data.response.response)
        getGraph3({
          data: chartData.data,
          labels: chartData.labels,
          title: "Transactions Duration",
          graph_type: "bar"
        })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  const handleClick = (value) => {
    store.dispatch(setCurrentScreen(value))
  };
  return (
    <>
      <div className="dash height-100-vh">
        <div className="nav">
          <img src={logo} alt='...'/>
          <div className="wp-user">
            <div>Welcome! {loggedUser}</div>
          </div>
        </div>
        <div className="sub-nav">
          <button class="home-button" onClick={() => handleClick('customQuery')}>Investigate</button>
          <button onClick={() => handleClick('login')}>logout</button>
        </div>
        {/* <!-- Upload Section --> */}
        <div className="nav-space"></div>
        <section class="upload-section">
          <h1>Upload Your Log Files</h1>
          <p>Accepted formats: .log, .txt. Max size: 10MB</p>
          <div class="upload-widget">
            <input type="file" id="file-upload" multiple style={{ display: 'none' }} />
            <label >{fileName}</label>
          </div>
          <div id="file-contents"></div>
          <div className='wp-otr-home-button'>
            <button class="home-button" onClick={() => sendFileDataToBackend()}>Analyze</button>
          </div>
        </section>

        {/* <!-- Recommendations Section --> */}
        <section class="recommendations-section">
          <h1>AI-Based Analysis</h1>
          {loadData === false ? <p>Loading ... </p> : 
           <div class="sections">
            {sections.map((section, index) => (
              <ReactMarkdown key={index} className="recommendation-card padding-50">
                {section}
              </ReactMarkdown>
            ))}
          </div>}
          <div class = "sections justify-center" >
            {graph1 && loadData === true ? <img src={graph1} alt="Graph" /> : <p></p>}
            {graph3 && loadData === true ? <img src={graph3} alt="Graph" /> : <p></p>}
            {graph2 && loadData === true ? <img src={graph2} alt="Graph" /> : <p></p>}
          </div>
        </section>
      </div>
    </>
  )
}
