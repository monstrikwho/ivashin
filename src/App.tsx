import Container from "@mui/material/Container";

import NotesForm from "./components/NotesForm/FormNote";
import Notes from "./components/Notes/Notes";

export default function App() {
  return (
    <Container maxWidth="sm">
      <h1 className="pageTitle">Notes with tags 🤳</h1>
      <NotesForm />
      <Notes />
    </Container>
  );
}
