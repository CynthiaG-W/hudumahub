import { useEffect, useState } from "react";

function MyHub({
savedServices,
loading,
error,
onUpdate,
onRemove,
onNavigateHome,
}) {
const [editingId, setEditingId] = useState(null);
const [noteValue, setNoteValue] = useState("");
const [removingId, setRemovingId] = useState(null);
const [actionMessage, setActionMessage] = useState("");

// =========================
// Temporary Success Message
// =========================

const showMessage = (message) => {
setActionMessage(message);
};

useEffect(() => {
if (!actionMessage) return;

const timer = setTimeout(() => {
  setActionMessage("");
}, 3000);

return () => clearTimeout(timer);

}, [actionMessage]);

// =========================
// Edit Note
// =========================

const startEditing = (savedService) => {
setEditingId(savedService.id);
setNoteValue(savedService.note || "");
};

const cancelEditing = () => {
setEditingId(null);
setNoteValue("");
};

const handleSaveNote = async (savedService) => {
await onUpdate(savedService.id, {
note: noteValue.trim(),
});

setEditingId(null);
setNoteValue("");
showMessage("📝 Note saved");

};

// =========================
// Favourite / Unfavourite
// =========================

const handleToggleFavorite = async (savedService) => {
const isAddingToFavorites = !savedService.is_favorite;


await onUpdate(savedService.id, {
  is_favorite: isAddingToFavorites,
});

showMessage(
  isAddingToFavorites
    ? "⭐ Added to favourites"
    : "☆ Removed from favourites"
);

};

// =========================
// Remove with Confirmation
// =========================

const handleRemove = async (savedService) => {
const confirmed = window.confirm(
`Are you sure you want to remove "${savedService.service.name}" from My Hub?`
);


if (!confirmed) return;

setRemovingId(savedService.id);

try {
  await onRemove(savedService.id);
  showMessage("🗑️ Place removed from My Hub");
} finally {
  setRemovingId(null);
}


};

// =========================
// Loading State
// =========================

if (loading) {
return ( <main className="hub-page"> <div className="page-status">
Loading your Hub... </div> </main>
);
}

// =========================
// My Hub Page
// =========================

return ( <main className="hub-page"> <div className="hub-header"> <div> <span className="eyebrow">MY HUB</span>

      <h1>Your important places, all together.</h1>

      <p>
        Save places you may need again and add personal
        notes to help you remember them.
      </p>
    </div>

    <button
      className="secondary-button"
      onClick={onNavigateHome}
    >
      ← Discover places
    </button>
  </div>

  {/* Temporary action confirmation */}
  {actionMessage && (
    <p className="status-message success-message hub-action-message">
      {actionMessage}
    </p>
  )}

  {/* Error message */}
  {error && (
    <p className="status-message error-message">
      {error}
    </p>
  )}

  {/* Empty State */}
  {!error && savedServices.length === 0 && (
    <section className="empty-state">
      <div className="empty-icon">♡</div>

      <h2>Your Hub is waiting for you</h2>

      <p>
        When you find a place worth remembering,
        save it here and make it your own.
      </p>

      <button
        className="primary-button"
        onClick={onNavigateHome}
      >
        Discover places
      </button>
    </section>
  )}

  {/* Saved Services */}
  {savedServices.length > 0 && (
    <section className="hub-grid">
      {savedServices.map((savedService) => {
        const service = savedService.service;

        return (
          <article
            className="hub-card"
            key={savedService.id}
          >
            <div className="hub-card-top">
              <div>
                <span className="service-category">
                  {service.category}
                </span>

                <h2>{service.name}</h2>
              </div>

              <button
                className={`favorite-button ${
                  savedService.is_favorite
                    ? "is-favorite"
                    : ""
                }`}
                onClick={() =>
                  handleToggleFavorite(savedService)
                }
                aria-label={
                  savedService.is_favorite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                {savedService.is_favorite ? "★" : "☆"}
              </button>
            </div>

            <p className="service-address">
              📍{" "}
              {service.address ||
                "Address not available"}
            </p>

            {/* Personal Note */}
            <div className="note-section">
              <span className="note-label">
                PERSONAL NOTE
              </span>

              {editingId === savedService.id ? (
                <>
                  <textarea
                    value={noteValue}
                    onChange={(event) =>
                      setNoteValue(event.target.value)
                    }
                    placeholder="Add something you'll want to remember..."
                    rows="4"
                  />

                  <div className="note-actions">
                    <button
                      className="text-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>

                    <button
                      className="primary-button small"
                      onClick={() =>
                        handleSaveNote(savedService)
                      }
                    >
                      Save note
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="note-text">
                    {savedService.note ||
                      "No personal note yet."}
                  </p>

                  <button
                    className="text-button edit-note-button"
                    onClick={() =>
                      startEditing(savedService)
                    }
                  >
                    {savedService.note
                      ? "Edit note"
                      : "+ Add a note"}
                  </button>
                </>
              )}
            </div>

            {/* Remove */}
            <div className="hub-card-actions">
              {removingId === savedService.id ? (
                <span className="removing-text">
                  Removing...
                </span>
              ) : (
                <button
                  className="remove-button"
                  onClick={() =>
                    handleRemove(savedService)
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </article>
        );
      })}
    </section>
  )}
</main>

);
}

export default MyHub;
