import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../Loader/Loader';
function Token(props) {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const _jwtToken = props.match.params.token;
        if(_jwtToken) {
            localStorage.setItem('_token', _jwtToken);
            setToken(_jwtToken);
        }
    }, []);
    return !token ? <Loader /> : <Redirect to="/dashboard" />

}

export default Token;