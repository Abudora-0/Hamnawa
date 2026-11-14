import { sampleDocument } from "./mockData";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

function copyDocument(document) {
  return JSON.parse(JSON.stringify(document));
}

function getFileType(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

async function getResponseError(response) {
  try {
    const data = await response.json();
    return typeof data.detail === "string"
      ? data.detail
      : "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

async function request(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Cannot reach the server. Please try again.");
  }

  if (!response.ok) {
    throw new Error(await getResponseError(response));
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}

export async function uploadDocument(file, language = "auto", signal) {
  if (USE_MOCK) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 1500);
      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(timer);
          reject(new DOMException("The request was aborted.", "AbortError"));
        },
        { once: true },
      );
    });
    const document = copyDocument(sampleDocument);
    document.title = file.name.replace(/\.[^/.]+$/, "");
    document.file_type = getFileType(file.name);
    return document;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);
  return request(`${BASE_URL}/documents`, {
    method: "POST",
    body: formData,
    signal,
  });
}

export async function getDocument(id) {
  if (USE_MOCK) {
    return copyDocument(sampleDocument);
  }

  return request(`${BASE_URL}/documents/${encodeURIComponent(id)}`);
}

export async function deleteDocument(id) {
  if (USE_MOCK) {
    return undefined;
  }

  return request(`${BASE_URL}/documents/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
