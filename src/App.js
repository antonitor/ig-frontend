import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SinglePost from "./pages/SinglePost";
import Signup from "./pages/Signup";

function App() {
  return (
    <div className="App">
      <h2>App</h2>
      <Router>
        <Nav></Nav>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/create">
            <Create />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route exact path="/:id">
            <SinglePost />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
