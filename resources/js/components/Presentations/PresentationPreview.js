import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import Loader from '../Loader/Loader';
import PresentationPreviewItem from './PresentationPreviewItem';
import {usePresentationPages} from '../hooks/pages/usePresentationPages';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PresentationPreview(props) {
    const presentationID = props.match.params.id;
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true
    };
    const [toggleExpanded, setToggleExpanded] = useState(false);
    const [presentation, setPresentation] = useState(null);
    const [loadingPages, setLoadingPages] = useState(true);
    useEffect(() => {
        usePresentationPages(presentationID).then((data) => {
            console.log(data);
            setPresentation(data);
            setLoadingPages(false);
        }).catch((err) => {
            if(err.response && err.response.status === 403) {
                props.history.push('/');
            }
        });
    }, []);
    return (
        <div className="box-section">
            <div className="container">
                <div className={toggleExpanded ? `box expanded-box`: `box`}>
                    {
                        presentation && !loadingPages ?
                        <Slider {...settings}>
                          {
                              presentation.pages.map((page) => <PresentationPreviewItem page={page} key={page.id} />)
                          }
                        </Slider>
                        : <Loader />
                    }
                        
                    <a onClick={() => setToggleExpanded(!toggleExpanded)} id="expandBox" className="expand-box">
                        <i className="fa fa-expand" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default PresentationPreview;