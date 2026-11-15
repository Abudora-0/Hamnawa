import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useDocument } from "../context/DocumentContext";
import { sampleDocument } from "../services/mockData";
import { uploadDocument } from "../services/api";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function validateFile(file) {
  if (!file) {
    return "Please choose a file to upload.";
  }

  const extension = file.name.split(".").pop().toLowerCase();
  if (extension !== "pdf" && extension !== "pptx") {
    return "Please choose a PDF or PPTX file.";
  }

  if (file.size === 0) {
    return "The file is empty. Please choose another file.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "The file must be 20 MB or smaller.";
  }

  return "";
}

function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [language, setLanguage] = useState("auto");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const controllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isDragging, setIsDragging] = useState(false);
  const { setDocument } = useDocument();
  const { announce } = useAnnouncer();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0] || null;
    setFile(selectedFile);
    setError("");
    if (selectedFile) {
      announce(`File selected: ${selectedFile.name}`);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0] || null;
    if (!droppedFile) {
      return;
    }
    setFile(droppedFile);
    setError("");
    if (fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(droppedFile);
      fileInputRef.current.files = transfer.files;
    }
    announce(`File selected: ${droppedFile.name}`);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isUploading) {
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setElapsedSeconds(0);
    announce("Processing your document, please wait");
    const controller = new AbortController();
    controllerRef.current = controller;
    let timedOut = false;
    const elapsedTimer = setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000,
    );
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 120000);
    const noticeTimer = setInterval(() => {
      announce("Still processing");
    }, 15000);

    try {
      const uploadedDocument = await uploadDocument(
        file,
        language,
        controller.signal,
      );
      setDocument(uploadedDocument);
      announce(`Document ready. ${uploadedDocument.sections.length} sections found.`);
      navigate(`/reader/${uploadedDocument.id}`);
    } catch (uploadError) {
      if (uploadError.name === "AbortError" && !timedOut) {
        return;
      }
      setError(
        timedOut
          ? "Processing took too long. Please try a smaller file."
          : uploadError.message,
      );
    } finally {
      clearInterval(elapsedTimer);
      clearTimeout(timeout);
      clearInterval(noticeTimer);
      controllerRef.current = null;
      if (isMountedRef.current) {
        setIsUploading(false);
      }
    }
  }

  function loadSample() {
    if (isUploading) {
      return;
    }

    setDocument(sampleDocument);
    announce(`Document ready. ${sampleDocument.sections.length} sections found.`);
    navigate(`/reader/${sampleDocument.id}`);
  }

  return (
    <section className="upload-page">
      <h1>Upload</h1>
      <p>Upload a PDF or slide deck to begin.</p>
      <div className="upload-layout">
        <form className="panel upload-form" onSubmit={handleSubmit} noValidate>
          <div
            className={`drop-zone${isDragging ? " is-dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <label htmlFor="document-file">Choose a document</label>
            <p id="file-hint">PDF or PowerPoint, up to 20 MB</p>
            <input
              ref={fileInputRef}
              id="document-file"
              type="file"
              accept=".pdf,.pptx"
              aria-describedby="file-hint"
              aria-invalid={Boolean(error)}
              onChange={handleFileChange}
            />
            <p>or drop a file here</p>
          </div>
          {file ? (
            <div className="file-ticket">
              <strong>{file.name}</strong>
              <span className="tag">{file.name.split(".").pop()}</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          ) : null}
          <div className="upload-actions">
            <label htmlFor="document-language">Document language</label>
            <select
              id="document-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
            <button className="btn" type="submit" aria-disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="thread thread-loading" aria-hidden="true" />
                  <span>Processing</span>
                </>
              ) : "Upload and process"}
            </button>
          </div>
          {isUploading ? <p>Processing: {elapsedSeconds} seconds</p> : null}
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>
        <aside className="panel privacy-note">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v11H5z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h2>Private by default</h2>
          <p>Your file is sent to our server to be processed. It is deleted after 24 hours or when you erase your data.</p>
        </aside>
      </div>
      <button className="btn-ghost" id="sample" type="button" onClick={loadSample} aria-disabled={isUploading}>
        Try the sample document
      </button>
    </section>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default Upload;
