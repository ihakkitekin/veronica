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
import { NotFound } from './Pages/NotFound/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/runner">
              <Runner />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
