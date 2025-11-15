// client/src/pages/UploadDocumentPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// --- API Configuration ---
// Make sure your server is running on port 5001
const API_URL = import.meta.env.VITE_BACKEND_URL;

const UploadDocumentPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear previous messages
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file); // This key 'document' MUST match the backend

    try {
      // Get the user from localStorage
      const userString = localStorage.getItem("user");
      if (!userString) {
        setMessage("You must be logged in to upload.");
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userString);
      // We pass the user ID as a header
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-user-id": user._id, // Assumes your user object in localStorage has _id
        },
      };

      await axios.post(`${API_URL}/api/documents/upload`, formData, config);

      setLoading(false);
      setMessage("File uploaded successfully! Redirecting to profile...");
      
      // Redirect to profile after upload
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data?.msg || "Upload failed. Please try again.";
      setMessage(errorMsg);
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-green-800">
              Upload Your Document
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Share your research, findings, or conservation reports.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onUpload}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4l-4-4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={onFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {file && (
                <p className="mt-2 text-sm text-green-700">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-center text-sm text-red-600">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadDocumentPage;