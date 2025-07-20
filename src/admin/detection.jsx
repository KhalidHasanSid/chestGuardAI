import React, { useState } from "react";
import axios from "axios";
import { Upload, RefreshCw, Loader2 } from "lucide-react";

const Detection = () => {
  const [xrayImage, setXrayImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [MR_no, setMR_no] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]= useState("")

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setXrayImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleMriChange = (event) => {
    setMR_no(event.target.value);
  };

  const analyzeXray = async () => {
    if (!xrayImage || !MR_no) {
      alert("Please enter MRI number and upload an X-ray image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    
    formData.append("xrayImage", xrayImage);

    try {
      const response = await axios.post(
        `http://localhost:4500/api/v1/chestguardDetection/sendImage/${MR_no}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      console.log("checking---",response.data.data.detection.result)
      setResult(response.data.data.detection[response.data.data.detection.length - 1].result);
    } catch (error) {
      console.error("Error analyzing X-ray:", error);
      alert("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setXrayImage(null);
    setImagePreview(null);
    setMR_no("");
    setResult("");
  };

  return (
    <div className="flex pt-8 justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-gray-100 p-8 rounded-lg border border-black shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-black text-center mb-6">MRI Analysis</h2>

  
        <input
          type="text"
          placeholder="Enter MRI Number"
          value={MR_no}
          onChange={handleMriChange}
          className="w-full mb-4 p-2 border border-black text-black  rounded-lg"
        />

     
        <div className="mb-4">
          <label className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 text-white">
            <Upload size={18} /> Upload X-ray
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

       
        {imagePreview && (
          <div className="flex justify-center mb-4">
            <img src={imagePreview} alt="Uploaded X-ray" className="w-64 h-auto rounded-lg border-2  shadow-lg" />
          </div>
        )}

       
        <button
          onClick={analyzeXray}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white mb-4 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Start Analysis"}
        </button>

       
        <button
          onClick={handleRefresh}
          className="w-full bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> Refresh
        </button>

      
        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-cyan-400">Analysis Result</h2>
            <p className="text-white">Consolidation: {result}</p>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Detection;