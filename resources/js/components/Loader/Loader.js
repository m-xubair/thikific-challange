import React, { Component } from 'react';

export default class Loader extends Component {
    render() {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-grow text-primary" style={{width: "6rem", height: "6rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}
