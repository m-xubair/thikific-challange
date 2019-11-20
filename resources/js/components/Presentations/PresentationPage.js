import React from 'react';
import { Link } from 'react-router-dom';
import {sortableContainer, sortableElement} from 'react-sortable-hoc';

const PresentationPage = sortableElement((props) => {
    const {page, toggleEdit, pageNumber, handlePageDelete, doPageDelete, isDisabled} = props;
    return (
        <div className="col-lg-3 col-sm-6">
            <div className="card">
                {
                    isDisabled ?
                    <div className="card-top">
                        <a onClick={() => toggleEdit(page.id)} className="edit-link">
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </a>
                        <a onClick={() => {handlePageDelete('Are you sure you want to delete this page?', doPageDelete,page.id)}} className="delete-link">
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </a>
                    </div>
                : <div className="card-top">&nbsp;</div>
                }
                <div className="card-image">
                    {
                        page.image ?
                            <img src={`/storage/presentations/${page.presentation_id}/${page.image}`} alt="" />
                        :
                            <img src="/images/dumy.png" alt="" />    
                    }
                    
                </div>
                <div className="card-content">
                    {
                        page.audio ?
                        <audio className="card-page-audio" src={`/storage/presentations/${page.presentation_id}/${page.audio}`} controls="controls" />
                        : null
                    }
                </div>
            </div>
            <div className="page-serial">{`Page: ${pageNumber}`}</div>
        </div>
)
                });

export default PresentationPage;