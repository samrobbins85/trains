import "./App.css";
import { Switch, Route } from "react-router-dom";
import Station from "./pages/station";
import Index from "./pages";
function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Index />
      </Route>
      <Route path="/:station">
        <Station />
      </Route>
    </Switch>
  );
}

export default App;
