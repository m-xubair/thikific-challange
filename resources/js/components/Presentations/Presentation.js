import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
function Presentation(props) {
    const {presentation, deletePresentation, handleDeletePresentation} = props;
    return (
        <div className="col-lg-3 col-sm-6">
            <div className="card">
                <div className="card-top">
                    <Link to={`/presentation/${presentation.id}/edit`} className="edit-link">
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </Link>
                    <a onClick={() => handleDeletePresentation('Are you sure you want to delete presentation? All images/audio files will be deleted.', deletePresentation, presentation.id)} className="delete-link">
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </div>
                <div className="card-image">
                    {
                        presentation.pages.length > 0 ?
                            <img src={`/storage/presentations/${presentation.id}/${presentation.pages[0].image}`} alt="" />
                        :
                            <img src="/images/dumy.png" alt="" />    
                    }
                    
                </div>
                <div className="card-content">
                    <h4>{presentation.name.length > 25 ? presentation.name.substr(0,25)+'...': presentation.name }</h4>
                </div>
            </div>
        </div>
    )

}

export default Presentation;