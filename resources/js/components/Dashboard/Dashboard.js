import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import Presentation from '../Presentations/Presentation';
import Loader from '../Loader/Loader';
import {usePresentationsData} from '../hooks/presentation/usePresentationsData';
import {usePresentationDelete} from '../hooks/presentation/usePresentationDelete';

import './dashboard.css';
import { async } from 'q';
function Dashboard(props) {
    const [presentations, setPresentation] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        usePresentationsData().then((data) => {
            setPresentation(data);
            setLoading(false);
        }).catch((err) => {
            if(err && err.status === 403) {
                props.history.push('/');
            }
        });
    }, []);
    const handleDeletePresentation = (message, cb, id) => {
        confirmAlert({
            title: 'Confirm Delete',
            message,
            buttons: [
                {
                label: 'Yes',
                onClick: () => cb(id)
                },
                {
                label: 'No',
                onClick: () => {}
                }
            ]
            })

    }
    const deletePresentation = (presentation) => {
        setLoading(true);
        const newPresentations = presentations.filter((p) => p.id !== presentation);
        usePresentationDelete(presentation)
        .then((response) => {
            if(response.status === 200 && response.data.success) {
                setPresentation(newPresentations);
                setLoading(false);
            }
        }).catch((err) => {
            if(err.response && err.response.status === 403) {
                props.history.push('/');
            }
        });
    }

    return (
        <div className="dashboard-section">
            <div className="container">
                <div className="button-container">
                    <Link to="/presentation/create" className="create-link">+ Create Presentation</Link>
                </div>
                
                    {
                        loading ? 
                            <Loader />
                        :
                            <div className="row">
                                {
                                    presentations.length === 0 ?
                                    <div className="no-presentation">You don't have any presentation yet. Click on CREATE PRESENTATION to create.</div>
                                    :
                                    presentations.map((presentation) => <Presentation presentation={presentation}  key={presentation.id}
                                    deletePresentation={deletePresentation} handleDeletePresentation={handleDeletePresentation}
                                    />)
                                }
                                
                            </div>    
                    }
                
            </div>
        </div>

        
    );

}

export default Dashboard;