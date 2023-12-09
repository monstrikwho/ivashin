import Container from "@mui/material/Container";

import NotesForm from "./components/NotesForm/FormNote";
import Notes from "./components/Notes/Notes";
import SnackbarMUI from "./components/UI/Snackbar";
import ThemeButton from "./components/UI/ThemeButton";

export default function App() {
  return (
    <Container maxWidth="sm">
      <h1 className="pageTitle">
        Notes with tags <ThemeButton />
      </h1>
      <NotesForm />
      <Notes />
      <SnackbarMUI />
    </Container>
  );
}
