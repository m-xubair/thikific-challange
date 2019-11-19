import React, { Component } from 'react';
import './login.css';


export default class Example extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                    <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Sign In</h5>
                        <form className="form-signin">
                            <hr className="my-4" />
                            <a href="/auth/google" className="btn btn-lg btn-google btn-block text-uppercase">
                                <i className="fa fa-google mr-2"></i> 
                                Sign in with Google
                            </a>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}


