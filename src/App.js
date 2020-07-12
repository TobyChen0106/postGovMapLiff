import React, { Component } from 'react';
import './App.css';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PostMap from "./containers/PostMap";
import Info from "./components/Info";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
  deviceType
} from "react-device-detect";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/">
            <PostMap deviceType={deviceType} />
          </Route>
          <Route path="/info" component={Info} />
        </Switch>
      </BrowserRouter>
    );
  }
}

