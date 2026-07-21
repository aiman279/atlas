import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWaypoint } from '../hooks/useWaypoint';
import { ImagePicker } from '../components/ImagePicker';

export function ProfileView() {
  const { data, updateProfile } = useWaypoint();
  const { profile } = data;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: '',
    role: '',
    travelStyle: '',
    preferences: '',
    lifeChapter: '',
    chapterNote: '',
    photo: '',
  });

  useEffect(() => {
    setDraft({
      name: profile.name,
      role: profile.role,
      travelStyle: profile.travelStyle,
      preferences: profile.preferences.join(', '),
      lifeChapter: profile.lifeChapter,
      chapterNote: profile.chapterNote,
      photo: profile.photo || '',
    });
  }, [profile]);

  function save() {
    updateProfile({
      name: draft.name.trim() || profile.name,
      role: draft.role.trim() || profile.role,
      travelStyle: draft.travelStyle.trim() || profile.travelStyle,
      preferences: draft.preferences
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      lifeChapter: draft.lifeChapter.trim() || profile.lifeChapter,
      chapterNote: draft.chapterNote.trim() || profile.chapterNote,
      photo: draft.photo || undefined,
    });
    setEditing(false);
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="section-head profile-edit-head">
        <h1 className="page-title" style={{ marginBottom: 0 }}>
          Profile
        </h1>
        <button type="button" onClick={() => (editing ? save() : setEditing(true))}>
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {!editing ? (
        <>
          <div className="profile-hero">
            <div
              className="home-avatar lg"
              style={
                profile.photo
                  ? { backgroundImage: `url(${profile.photo})` }
                  : undefined
              }
            >
              {!profile.photo && profile.name.charAt(0)}
            </div>
            <h2 className="page-title">{profile.name}</h2>
            <p className="page-lead">{profile.role}</p>
          </div>

          <section className="chapter-chip mb">
            <p className="chip-label">Current chapter</p>
            <p className="chip-title">{profile.lifeChapter}</p>
            <p className="chip-note">{profile.chapterNote}</p>
          </section>

          <div className="profile-grid">
            <div className="fund-card">
              <p className="label">Travel style</p>
              <p className="profile-value">{profile.travelStyle}</p>
            </div>
            <div className="fund-card">
              <p className="label">Preferences</p>
              <div className="place-chips">
                {profile.preferences.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          <section className="home-section">
            <div className="section-head">
              <h2>Statistics</h2>
            </div>
            <div className="stat-cards">
              <div className="stat-card">
                <p className="stat-num">{profile.countriesVisited}</p>
                <p className="stat-lbl">Countries</p>
              </div>
              <div className="stat-card">
                <p className="stat-num">{profile.totalJourneys}</p>
                <p className="stat-lbl">Journeys</p>
              </div>
              <div className="stat-card">
                <p className="stat-num">{profile.travelDays}</p>
                <p className="stat-lbl">Days</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="form-stack edit-panel">
          <ImagePicker
            label="Profile photo"
            value={draft.photo}
            onChange={(url) => setDraft((d) => ({ ...d, photo: url }))}
            round
          />
          <label>
            Name
            <input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </label>
          <label>
            Role
            <input
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
            />
          </label>
          <label>
            Current chapter
            <input
              value={draft.lifeChapter}
              onChange={(e) =>
                setDraft((d) => ({ ...d, lifeChapter: e.target.value }))
              }
            />
          </label>
          <label>
            Chapter note
            <textarea
              value={draft.chapterNote}
              onChange={(e) =>
                setDraft((d) => ({ ...d, chapterNote: e.target.value }))
              }
            />
          </label>
          <label>
            Travel style
            <input
              value={draft.travelStyle}
              onChange={(e) =>
                setDraft((d) => ({ ...d, travelStyle: e.target.value }))
              }
            />
          </label>
          <label>
            Preferences
            <input
              value={draft.preferences}
              onChange={(e) =>
                setDraft((d) => ({ ...d, preferences: e.target.value }))
              }
              placeholder="Nature, Culture, Solo"
            />
          </label>
          <button type="button" className="btn-primary" onClick={save}>
            Save profile
          </button>
        </div>
      )}
    </motion.div>
  );
}
