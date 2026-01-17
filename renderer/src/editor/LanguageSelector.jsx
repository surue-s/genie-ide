import { LANGUAGE_VERSIONS } from "../core/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

export default function LanguageSelector({ currentDocument, onChangeLanguage }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ fontSize: 12, color: "#8b93a7", display: "block", marginBottom: 6 }}>
        LANGUAGE
      </label>
      <select
        value={currentDocument?.language || "javascript"}
        onChange={(e) => onChangeLanguage(e.target.value)}
        style={{
          width: "100%",
          background: "#1a1d27",
          color: "#ccc",
          border: "1px solid #2a2f3d",
          padding: "6px 8px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {languages.map(([language, version]) => (
          <option key={language} value={language}>
            {language.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}