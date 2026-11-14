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

function Reader() {
  const { id } = useParams();
  const { document: contextDocument, setDocument } = useDocument();
  const { cuesEnabled, speechRate } = useSettings();
  const { announce } = useAnnouncer();
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
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
    getDocument(id)
      .then((loadedDocument) => {
        setDocument(loadedDocument);
        setLoadingId("");
      })
      .catch((loadError) => {
        setError(loadError.message);
        setLoadingId("");
      });
  }, [contextDocument, id, setDocument]);

  const items = useMemo(
    () => (currentDocument ? buildQueue(currentDocument, cuesEnabled) : []),
    [currentDocument, cuesEnabled],
  );
  const player = useReadingPlayer(items);
  const readerActions = useReaderActions(player, items, currentDocument);

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
  }, [announce, currentDocument, items]);

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

  const voiceActions = { ...readerActions, addBookmark: addCurrentBookmark };
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
  useReaderShortcuts(actions);

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
        <h1>Reader</h1>
        <p role="alert">{error}</p>
        <Link to="/upload">Upload again</Link>
      </section>
    );
  }

  if (loadingId === id) {
    return <p role="status">Loading document</p>;
  }

  if (!currentDocument) {
    return (
      <section>
        <h1>Reader</h1>
        <p>No document loaded yet.</p>
        <Link to="/upload">Upload a document</Link>
      </section>
    );
  }

  const isSpeechSupported = speech.isSupported();
  return (
    <section>
      <h1>{currentDocument.title}</h1>
      {voiceCommands.supported ? (
        <>
          <button
            type="button"
            aria-pressed={voiceCommands.listening}
            onClick={actions.toggleVoiceCommands}
          >
            Voice commands: {voiceCommands.listening ? "on" : "off"}
          </button>
          <p>
            Voice commands send your speech to your browser&apos;s speech
            service.
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
      ) : (
        <p role="status">
          Your browser does not support speech. Try Chrome or Edge.
        </p>
      )}
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
      <DocumentView
        document={currentDocument}
        currentTargetId={items[player.index]?.targetId}
      />
    </section>
  );
}

export default Reader;
