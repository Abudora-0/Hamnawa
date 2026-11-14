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
  const isMountedRef = useRef(true);
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
    setFile(event.target.files[0] || null);
    setError("");
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
    <section>
      <h1>Upload</h1>
      <p>Upload a PDF or slide deck to begin.</p>
      <p className="notice">
        Your file is sent to our server to be processed. It is deleted after
        24 hours or when you erase your data.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="document-file">Choose a document</label>
        <p id="file-hint">PDF or PowerPoint, up to 20 MB</p>
        <input
          id="document-file"
          type="file"
          accept=".pdf,.pptx"
          aria-describedby="file-hint"
          aria-invalid={Boolean(error)}
          onChange={handleFileChange}
        />
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
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button type="submit" aria-disabled={isUploading}>
          {isUploading ? "Processing your document, please wait" : "Upload and process"}
        </button>
        {isUploading ? (
          <p>Processing: {elapsedSeconds} seconds</p>
        ) : null}
      </form>
      <button type="button" onClick={loadSample} aria-disabled={isUploading}>
        Try the sample document
      </button>
    </section>
  );
}

export default Upload;
