import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DocumentView from "../components/DocumentView";
import ReaderControls from "../components/ReaderControls";
import { useDocument } from "../context/DocumentContext";
import { useSettings } from "../context/SettingsContext";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useReadingPlayer } from "../hooks/useReadingPlayer";
import { useReaderActions } from "../hooks/useReaderActions";
import { useReaderShortcuts } from "../hooks/useReaderShortcuts";
import { useVoiceCommands } from "../hooks/useVoiceCommands";
import ReaderTools from "../components/ReaderTools";
import { getDocument } from "../services/api";
import { speech } from "../services/speech";
import {
  addBookmark as saveBookmark,
  addRecent,
  getBookmarks,
  getProgress,
  removeBookmark as deleteBookmark,
  saveProgress,
} from "../utils/documentMemory";
import { buildQueue } from "../utils/readingQueue";
import EmptyState from "../components/EmptyState";
import ReaderTitleBar from "../components/ReaderTitleBar";
import Skeleton from "../components/Skeleton";
import { useBusy } from "../context/BusyContext";
import usePageTitle from "../hooks/usePageTitle";

function Reader() {
  const { id } = useParams();
  const { document: contextDocument, setDocument } = useDocument();
  const { cuesEnabled, speechRate, screenReaderMode } = useSettings();
  const { announce } = useAnnouncer();
  const { start, stop } = useBusy();
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const requestedId = useRef("");
  const restoredDocumentId = useRef("");

  const currentDocument =
    id && String(contextDocument?.id) !== id ? null : contextDocument;

  useEffect(() => {
    if (!id) {
      requestedId.current = "";
      setLoadingId("");
      setError("");
      return;
    }
    if (String(contextDocument?.id) === id || requestedId.current === id) {
      return;
    }

    requestedId.current = id;
    setLoadingId(id);
    setError("");
    const busyOperation = start();
    getDocument(id)
      .then((loadedDocument) => {
        setDocument(loadedDocument);
        setLoadingId("");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setLoadingId("");
      })
      .finally(() => stop(busyOperation));
  }, [contextDocument, id, retryCount, setDocument, start, stop]);

  const items = useMemo(
    () => (currentDocument ? buildQueue(currentDocument, cuesEnabled) : []),
    [currentDocument, cuesEnabled],
  );
  const player = useReadingPlayer(items);
  const readerActions = useReaderActions(player, items, currentDocument);
  const pageTitle = error
    ? "Could not open document"
    : loadingId === id
      ? "Loading"
      : currentDocument && player.hasStarted
        ? `${player.isPlaying ? "Reading" : "Paused"}: ${currentDocument.title}`
        : currentDocument?.title || "Reader";
  usePageTitle(pageTitle);

  useEffect(() => {
    if (!currentDocument || restoredDocumentId.current === currentDocument.id) {
      return;
    }

    restoredDocumentId.current = currentDocument.id;
    addRecent({
      id: currentDocument.id,
      title: currentDocument.title,
      file_type: currentDocument.file_type,
      opened_at: new Date().toISOString(),
    });
    setBookmarks(getBookmarks(currentDocument.id));

    const progress = getProgress(currentDocument.id);
    if (progress) {
      const savedTargetIndex = progress.targetId
        ? items.findIndex((item) => item.targetId === progress.targetId)
        : -1;
      const savedIndex =
        savedTargetIndex === -1 ? Number(progress.index) : savedTargetIndex;
      if (savedIndex >= 0 && savedIndex < items.length) {
        player.goTo(savedIndex);
        announce(`Resumed at section ${items[savedIndex].sectionTitle}`);
      }
    }
  }, [announce, currentDocument, items, player]);

  useEffect(() => {
    if (!currentDocument || !items[player.index]) {
      return undefined;
    }
    const timer = setTimeout(() => {
      saveProgress(currentDocument.id, {
        index: player.index,
        targetId: items[player.index].targetId,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [currentDocument, items, player.index]);

  function addCurrentBookmark() {
    const item = items[player.index];
    if (!currentDocument || !item) {
      return;
    }
    const locationLabel = currentDocument.file_type === "pptx" ? "slide" : "page";
    const bookmark = {
      id: `bookmark-${Date.now()}`,
      label: `${item.sectionTitle}, ${locationLabel} ${item.location}`,
      targetId: item.targetId,
      index: player.index,
    };
    saveBookmark(currentDocument.id, bookmark);
    setBookmarks((currentBookmarks) => [bookmark, ...currentBookmarks]);
    announce("Bookmark added");
  }

  function removeCurrentBookmark(bookmarkId) {
    if (!currentDocument) {
      return;
    }
    deleteBookmark(currentDocument.id, bookmarkId);
    setBookmarks((currentBookmarks) =>
      currentBookmarks.filter((bookmark) => bookmark.id !== bookmarkId),
    );
  }

  function retryLoad() {
    requestedId.current = "";
    setError("");
    setRetryCount((count) => count + 1);
  }

  const voiceActions = {
    ...readerActions,
    addBookmark: addCurrentBookmark,
  };
  const voiceCommands = useVoiceCommands(voiceActions, player.isPlaying);
  const actions = {
    ...voiceActions,
    toggleVoiceCommands: () => {
      if (voiceCommands.listening) {
        voiceCommands.stop();
        announce("Voice commands off");
      } else {
        voiceCommands.start();
        announce("Voice commands on");
      }
    },
  };
  useReaderShortcuts(actions, screenReaderMode);

  useEffect(() => {
    if (player.index === 0 && !player.isPlaying) {
      return;
    }
    if (items[player.index]) {
      document
        .getElementById(items[player.index].targetId)
        ?.scrollIntoView({ block: "center" });
    }
  }, [items, player.index, player.isPlaying]);

  if (error) {
    return (
      <section>
        <EmptyState
          headingLevel={1}
          title="We could not open this document"
          description={error}
          action={<button className="btn" type="button" onClick={retryLoad}>Try again</button>}
          secondaryAction={<Link className="btn-ghost" to="/upload">Upload</Link>}
        />
      </section>
    );
  }

  if (loadingId === id) {
    return <div className="reader-loading" role="status"><h1 className="live-region">Loading document</h1><Skeleton /></div>;
  }

  if (!currentDocument) {
    return (
      <section>
        <EmptyState
          headingLevel={1}
          title="Your reader is waiting"
          description="Upload a document to start reading and listening."
          action={<Link className="btn" to="/upload">Upload a document</Link>}
        />
      </section>
    );
  }

  const isSpeechSupported = speech.isSupported();
  const sectionIds = [...new Set(items.map((item) => item.sectionId))];
  const currentSectionIndex = sectionIds.indexOf(items[player.index]?.sectionId);
  const progress = sectionIds.length
    ? Math.round(((currentSectionIndex + 1) / sectionIds.length) * 100)
    : 0;
  return (
    <section className="reader-page">
      <ReaderTitleBar document={currentDocument} progress={progress} />
      {voiceCommands.supported ? (
        <>
          <button
            className="btn-ghost voice-toggle"
            type="button"
            aria-pressed={voiceCommands.listening}
            onClick={actions.toggleVoiceCommands}
          >
            Voice commands
            <span aria-hidden="true">
              : {voiceCommands.listening ? "on" : "off"}
            </span>
          </button>
          <p>
            Voice commands send your speech to your browser&apos;s speech
            service. Use headphones so the microphone does not hear the reader.
          </p>
        </>
      ) : (
        <p role="status">
          Voice commands need Chrome or Edge. Keyboard controls still work.
        </p>
      )}
      {isSpeechSupported ? (
        <ReaderControls
          isPlaying={player.isPlaying}
          index={player.index}
          speed={speechRate}
          actions={actions}
          total={items.length}
        />
      ) : <p role="status">Your browser does not support speech. Try Chrome or Edge.</p>}
      <div className="reader-layout">
        <DocumentView
          document={currentDocument}
          currentTargetId={items[player.index]?.targetId}
        />
        {isSpeechSupported ? (
          <ReaderTools
            document={currentDocument}
            currentSectionId={items[player.index]?.sectionId}
            onSelectSection={actions.goToSection}
            goToPage={actions.goToPage}
            search={actions.search}
            nextMatch={actions.nextMatch}
            previousMatch={actions.previousMatch}
            matchCount={actions.matchCount}
            currentMatch={actions.currentMatch}
            bookmarks={bookmarks}
            onAddBookmark={actions.addBookmark}
            onGoToBookmark={(bookmark) =>
              actions.goToTarget(bookmark.targetId, bookmark.index)
            }
            onRemoveBookmark={removeCurrentBookmark}
          />
        ) : null}
      </div>
    </section>
  );
}

export default Reader;
