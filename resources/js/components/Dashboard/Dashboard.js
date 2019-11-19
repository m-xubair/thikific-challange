import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Presentation from '../Presentations/Presentation';
import Loader from '../Loader/Loader';
import {usePresentationsData} from '../hooks/usePresentationsData';
import {usePresentationDelete} from '../hooks/usePresentationDelete';

import './dashboard.css';
import { async } from 'q';
function Dashboard(props) {
    const [presentations, setPresentation] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        usePresentationsData()
        .then((response) => {
            if(response.status === 200) {
                setPresentation(response.data);
                setLoading(false);
            }
        }).catch((err) => {
            props.history.push('/');
        });
    }, [])

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
            props.history.push('/');
        });
    }

    return (
        <div className="dashboard-section">
            <div className="container">
                <Link to="/presentation/create" className="create-link">+ Create Presentation</Link>
                
                    {
                        loading ? 
                            <Loader />
                        :
                            <div className="row">
                                {
                                    presentations.map((presentation) => <Presentation presentation={presentation}  key={presentation.id}
                                    deletePresentation={deletePresentation}
                                    />)
                                }
                                
                            </div>    
                    }
                
            </div>
        </div>

        
    );

}

export default Dashboard;