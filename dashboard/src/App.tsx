import * as React from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';
import { Header } from './Components/Header/Header';
import { Runner } from './Pages/Runner/Runner';

import './app.css';
import { Home } from './Pages/Home/Home';


export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/runner">
            <Runner />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
