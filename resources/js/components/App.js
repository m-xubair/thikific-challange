import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
import Login from './Login/Login';
import Token from './Token/Token';
import Dashboard from './Dashboard/Dashboard';
import EditPresentation from './Presentations/EditPresentation';
import CreatePresentation from './Presentations/CreatePresentation';
import PresentationPages from './Presentations/PresentationPages';
import PresentationPreview from './Presentations/PresentationPreview';

export default class App extends Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={Login} />
                <Route path="/token/:token" component={Token} />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/presentation/:id/edit" component={EditPresentation} />
                <Route path="/presentation/create" component={CreatePresentation} />
                <Route path="/presentation/:id/pages" component={PresentationPages} />
                <Route path="/presentation/:id/preview" component={PresentationPreview} />

            </Router>

            
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
