import { Provider } from "react-redux";
import store from "./store";
import ProfileCalendar from "./components/ProfileCalendar";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css'

function App() {
  return (
    <Provider store={store()}>
      <ThemeProvider>
        <ProfileCalendar />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
