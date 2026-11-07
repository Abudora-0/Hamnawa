import { useSettings } from "../context/SettingsContext";

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "contrast", label: "High contrast" },
];

const fontSizes = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra large" },
];

function Settings() {
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  return (
    <section>
      <h1>Settings</h1>
      <fieldset>
        <legend>Theme</legend>
        {themes.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={theme === option.value}
              onChange={(event) => setTheme(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Font size</legend>
        {fontSizes.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name="font-size"
              value={option.value}
              checked={fontSize === option.value}
              onChange={(event) => setFontSize(event.target.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </section>
  );
}

export default Settings;
