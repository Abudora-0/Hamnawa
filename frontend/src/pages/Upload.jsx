import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useBusy } from "../context/BusyContext";
import usePageTitle from "../hooks/usePageTitle";
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
  const [uploadStage, setUploadStage] = useState("choose");
  const controllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isDragging, setIsDragging] = useState(false);
  const { setDocument } = useDocument();
  const { announce } = useAnnouncer();
  const { start, stop } = useBusy();
  const navigate = useNavigate();
  usePageTitle(isUploading ? "Processing..." : "Upload");

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
    setUploadStage("choose");
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
    setUploadStage("choose");
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
    setUploadStage("process");
    setElapsedSeconds(0);
    announce("Processing your document, please wait");
    const busyOperation = start();
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
      setUploadStage("listen");
      announce(`Document ready. ${uploadedDocument.sections.length} sections found.`);
      navigate(`/reader/${uploadedDocument.id}`);
    } catch (uploadError) {
      if (uploadError.name === "AbortError" && !timedOut) {
        if (isMountedRef.current) {
          setUploadStage("choose");
          announce("Upload cancelled");
        }
        return;
      }
      setUploadStage("choose");
      setError(
        timedOut
          ? "Processing took too long. Please try a smaller file."
          : uploadError.message,
      );
    } finally {
      clearInterval(elapsedTimer);
      clearTimeout(timeout);
      clearInterval(noticeTimer);
      stop(busyOperation);
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

  function removeFile() {
    setFile(null);
    setError("");
    setUploadStage("choose");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.focus();
    }
  }

  function cancelUpload() {
    controllerRef.current?.abort();
    fileInputRef.current?.focus();
  }

  const stages = [
    { key: "choose", label: "Choose" },
    { key: "process", label: "Process" },
    { key: "listen", label: "Listen" },
  ];
  const currentStageIndex = stages.findIndex((stage) => stage.key === uploadStage);

  return (
    <section className="upload-page">
      <PageHeader
        eyebrow="Upload / Start here"
        title="Upload"
        description="Upload a PDF or slide deck to begin."
      />
      <ol className="upload-steps" aria-label="Upload progress">
        {stages.map((stage, index) => (
          <li
            className={`upload-step${index === currentStageIndex ? " is-current" : ""}${index < currentStageIndex ? " is-complete" : ""}`}
            key={stage.key}
            aria-current={index === currentStageIndex ? "step" : undefined}
          >
            {stage.label}
          </li>
        ))}
      </ol>
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
            <svg className="drop-icon" aria-hidden="true" viewBox="0 0 48 48">
              <path d="M24 33V8m0 0L14 18m10-10 10 10M9 29v10h30V29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
              <button className="btn-ghost" type="button" onClick={removeFile}>
                Remove
              </button>
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
          {isUploading ? (
            <div className="processing-panel panel">
              <div className="processing-wave" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <strong>Reading your document.</strong>
              <p>Large files can take up to a minute.</p>
              <p>Elapsed: {elapsedSeconds} seconds</p>
              <button className="btn-ghost" type="button" onClick={cancelUpload}>
                Cancel
              </button>
            </div>
          ) : null}
          {error && <p className="error-message" role="alert">{error}</p>}
        </form>
        <aside className="panel upload-tips">
          <h2>Tips</h2>
          <ul>
            <li>Supported files: PDF and PPTX.</li>
            <li>Keep files at 20 MB or smaller.</li>
            <li>Scanned files may take longer to read.</li>
          </ul>
          <p className="privacy-note">Your file is deleted after 24 hours or when you erase your data.</p>
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
