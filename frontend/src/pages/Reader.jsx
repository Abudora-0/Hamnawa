import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DocumentView from "../components/DocumentView";
import ReaderControls from "../components/ReaderControls";
import { useDocument } from "../context/DocumentContext";
import { useSettings } from "../context/SettingsContext";
import { useReadingPlayer } from "../hooks/useReadingPlayer";
import { useReaderActions } from "../hooks/useReaderActions";
import { useReaderShortcuts } from "../hooks/useReaderShortcuts";
import ReaderTools from "../components/ReaderTools";
import { getDocument } from "../services/api";
import { speech } from "../services/speech";
import { buildQueue } from "../utils/readingQueue";

function Reader() {
  const { id } = useParams();
  const { document: contextDocument, setDocument } = useDocument();
  const { cuesEnabled, speechRate } = useSettings();
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const requestedId = useRef("");

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
  const actions = useReaderActions(player, items, currentDocument);
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
    return <p role="alert">{error}</p>;
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
      {isSpeechSupported ? (
        <ReaderControls
          {...player}
          speed={speechRate}
          actions={actions}
          repeat={actions.repeat}
          goToStart={actions.goToStart}
          goToEnd={actions.goToEnd}
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
