import { LANGUAGE_VERSIONS } from "../core/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

export default function LanguageSelector({ currentDocument, onChangeLanguage, theme }) {
  const colors = theme?.colors || {
    textMuted: "#8b93a7",
    buttonBg: "#1a1d27",
    buttonText: "#ccc",
    borderSubtle: "#2a2f3d"
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={{ fontSize: 12, color: colors.textMuted, display: "block", marginBottom: 6 }}>
        LANGUAGE
      </label>
      <select
        value={currentDocument?.language || "javascript"}
        onChange={(e) => onChangeLanguage(e.target.value)}
        style={{
          width: "100%",
          background: colors.buttonBg,
          color: colors.buttonText,
          border: `1px solid ${colors.borderSubtle}`,
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