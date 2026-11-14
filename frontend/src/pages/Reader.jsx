import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DocumentView from "../components/DocumentView";
import ReaderControls from "../components/ReaderControls";
import { useDocument } from "../context/DocumentContext";
import { useSettings } from "../context/SettingsContext";
import { useAnnouncer } from "../context/AnnouncementContext";
import { useReadingPlayer } from "../hooks/useReadingPlayer";
import { useReaderShortcuts } from "../hooks/useReaderShortcuts";
import { getDocument } from "../services/api";
import { speech } from "../services/speech";
import { buildQueue } from "../utils/readingQueue";

function Reader() {
  const { id } = useParams();
  const { document: contextDocument, setDocument } = useDocument();
  const { cuesEnabled, speechRate, setSpeechRate } = useSettings();
  const { announce } = useAnnouncer();
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
  useReaderShortcuts(player, changeSpeed);

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

  function changeSpeed(amount) {
    const nextRate = Math.min(3, Math.max(0.5, speechRate + amount));
    setSpeechRate(nextRate);
    announce(`Speed ${nextRate} times normal`);
  }

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
          onSpeedChange={changeSpeed}
          total={items.length}
        />
      ) : (
        <p role="status">
          Your browser does not support speech. Try Chrome or Edge.
        </p>
      )}
      <DocumentView
        document={currentDocument}
        currentTargetId={items[player.index]?.targetId}
      />
    </section>
  );
}

export default Reader;
