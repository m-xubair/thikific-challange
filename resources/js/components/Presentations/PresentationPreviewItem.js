import React, { useState, useEffect } from 'react';

function PresentationPreviewItem(props) {
    const {page} = props;
    return (
        <div>
            <img className="d-block w-100" src={`/storage/presentations/${page.presentation_id}/${page.image}`}/>
            <div className="">
                {
                    page.audio ?
                    <audio className="box-audio" src={`/storage/presentations/${page.presentation_id}/${page.audio}`} controls="controls" />
                    : null
                }
            </div>
        </div>
                          
    )

}

export default PresentationPreviewItem;