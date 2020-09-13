import * as React from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';
import './app.css';
import { Header } from './Components/Header/Header';
import { Runner } from './Pages/Runner/Runner';
import { Home } from './Pages/Home/Home';
import { NotFound } from './Pages/NotFound/NotFound';
import { Provider } from 'react-redux';
import { store } from './redux';

export function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App;
