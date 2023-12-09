import { useContext } from "react";
import ThemeContext from "../../store/themeContext";

export default function ThemeButton() {
  const themeCtx = useContext(ThemeContext);
  let theme = themeCtx.theme;
  return (
    <div className="theme-button" onClick={() => themeCtx.toggleTheme()}>
      {theme === "light" ? "🌕" : "🌑"}
    </div>
  );
}
