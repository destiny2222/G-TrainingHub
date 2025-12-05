import { useRef, useState } from "react";
import api from "../../utils/api";

export default function FileInput({ isOpen, setIsOpen }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file_paths", file);
    formData.append("description", description);

    try {
      setLoading(true);
      const res = await api.post("user/assignments/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      setError(null);
      setMessage("File uploaded successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setError(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  // validateFile returns boolean and sets state (file/error)
  const validateFile = (f) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (!f) {
      setFile(null);
      setError("No file selected.");
      return false;
    }

    if (f.size > MAX_SIZE) {
      setFile(null);
      setError("File is too large. Maximum size is 10 MB.");
      return false;
    }

    // Accept any file type and extension
    setFile(f);
    setError(null);
    return true;
  };

  const handleFileChange = (e) => {
    const f = e?.target?.files?.[0];
    if (!f) {
      return;
    }
    validateFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const f = e?.dataTransfer?.files?.[0];
    if (!f) return;

    validateFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setMessage("");
    setDescription("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    handleRemove();
    setIsOpen(false);
  };

  return (
    <div
      style={{
        display: isOpen ? "block" : "none",
      }}
    >
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div className="file-modal">
        <div className="file-modal-header">
          <div className="modal-logo">
            <span className="logo-circle">
              <img src="/logo512.png" alt="Logo" />
            </span>
          </div>

          <button className="btn-close" onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                fill="var(--c-text-secondary)"
              />
            </svg>
          </button>
        </div>

        <div className="file-modal-body">
          <p className="file-modal-title">Upload Your Assignment</p>
          <p className="file-modal-description">Attach the file below</p>
          <button
            className={`upload-area ${dragOver ? "drag-over" : ""}`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="upload-area-icon">
              {/* Upload Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 340.531 419.116"
              >
                <defs>
                  <clipPath id="clip-files-new">
                    <rect width="340.531" height="419.116" />
                  </clipPath>
                </defs>
                <g clipPath="url(#clip-files-new)">
                  <path
                    d="M-2904.708-8.885A39.292,39.292,0,0,1-2944-48.177V-388.708A39.292,39.292,0,0,1-2904.708-428h209.558a13.1,13.1,0,0,1,9.3,3.8l78.584,78.584a13.1,13.1,0,0,1,3.8,9.3V-48.177a39.292,39.292,0,0,1-39.292,39.292Zm-13.1-379.823V-48.177a13.1,13.1,0,0,0,13.1,13.1h261.947a13.1,13.1,0,0,0,13.1-13.1V-323.221h-52.39a26.2,26.2,0,0,1-26.194-26.195v-52.39h-196.46A13.1,13.1,0,0,0-2917.805-388.708Zm146.5,241.621a14.269,14.269,0,0,1-7.883-12.758v-19.113h-68.841c-7.869,0-7.87-47.619,0-47.619h68.842v-18.8a14.271,14.271,0,0,1,7.882-12.758,14.239,14.239,0,0,1,14.925,1.354l57.019,42.764c.242.185.328.485.555.671a13.9,13.9,0,0,1,2.751,3.292,14.57,14.57,0,0,1,.984,1.454,14.114,14.114,0,0,1,1.411,5.987,14.006,14.006,0,0,1-1.411,5.973,14.653,14.653,0,0,1-.984,1.468,13.9,13.9,0,0,1-2.751,3.293c-.228.2-.313.485-.555.671l-57.019,42.764a14.26,14.26,0,0,1-8.558,2.847A14.326,14.326,0,0,1-2771.3-147.087Z"
                    transform="translate(2944 428)"
                    fill="var(--c-action-primary)"
                  />
                </g>
              </svg>
            </span>

            <span className="upload-area-title">
              Drag file(s) here to upload.
            </span>

            <span className="upload-area-description">
              Alternatively, you can select a file by <br />
              <strong>clicking here</strong>
              <br />
              <strong>{file ? file.name : ""}</strong>
            </span>
          </button>
          <input
            className="input"
            type="text"
            placeholder="Enter a description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
          {message && (
            <p style={{ color: "green", marginTop: "8px" }}>{message}</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleRemove}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleUpload}>
            {loading ? (
              <div className="spinner spinner-sm"></div>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
