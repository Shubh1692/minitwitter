import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route, Redirect, Switch
} from 'react-router-dom';
import { withCookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Feeds from './pages/feeds/Feeds';

class App extends Component {
  render() {
    const { cookies } = this.props;
    const token = cookies.get('token');
    return (
      <Router>
        {
        /**
            * React router Switch case for authenticated or not authenticated route
         */
        }
        {token ? <Switch>
          <Route exact path='/feeds' render={() => (<Feeds {
            ...{
              token,
              cookies: this.props.cookies
            }
          } />)}></Route>
          <Route render={() => (<Redirect to="/feeds" />)} />
        </Switch> :
          <Switch>
            <Route exact path='/login' render={() => (<Login {
              ...{
                cookies: this.props.cookies
              }
            } />)}></Route>
            <Route exact path='/register' render={() => (<Register {
              ...{
                cookies: this.props.cookies
              }
            } />)}></Route>
            <Route render={() => (<Redirect to="/login" />)} />
          </Switch>
        }
      </Router>
    );
  }
}

export default withCookies(App);
