import { useState } from "react";
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
  const { setDocument } = useDocument();
  const { announce } = useAnnouncer();
  const navigate = useNavigate();

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
    announce("Processing your document, please wait");

    try {
      const uploadedDocument = await uploadDocument(file);
      setDocument(uploadedDocument);
      announce(`Document ready. ${uploadedDocument.sections.length} sections found.`);
      navigate(`/reader/${uploadedDocument.id}`);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
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
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button type="submit" aria-disabled={isUploading}>
          {isUploading ? "Processing your document, please wait" : "Upload and process"}
        </button>
      </form>
      <button type="button" onClick={loadSample} aria-disabled={isUploading}>
        Try the sample document
      </button>
    </section>
  );
}

export default Upload;
