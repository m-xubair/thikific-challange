import React, { useState, useEffect } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Redirect } from 'react-router-dom';
import {usePresentationCreate} from '../hooks/presentation/usePresentationCreate';
import Loader from '../Loader/Loader';
function CreatePresentation(props) {
    const [presentation, setPresentation] = useState({name: '', description: ''});
    const [errors, setErrors] = useState(null);
    //Handle API requet to create new presentation.
    const handleUpdate = () => {
        // show error if name OR description is empty
        if(!presentation.name || !presentation.description) {
            let validation_erros = [];
            !presentation.name ? validation_erros.push('Presentation name is required.') : null;
            !presentation.description ? validation_erros.push('Presentation description is required') : null;
            setErrors(validation_erros);
            return;
        }
        // API call to create new presentation
        usePresentationCreate(presentation).then((response) => {
            if(response.data.errors) {
                setErrors(response.data.errors)
                return;
            }
            props.history.push('/dashboard');
        }).catch((err) =>{
            if(err.response && err.response.status === 400) {
                props.history.push('/');
            }
        })
    }
    return (
        <div className="dashboard-section">
        <div className="form-section">
            <div className="container">
                <a onClick={() => props.history.push('/dashboard')} className="create-link"> <i className="fa fa-arrow-left"></i> Go Back</a>
                <h3>Create Presentation</h3>
                <form>
                    {
                        errors ?
                            <div className="alert alert-danger">
                                {
                                    errors.map((err) => <div>{err}</div>)
                                }
                            </div>
                        : null    
                    }
                    
                    <div className="form-group">
                        <input type="text" className="form-control" value={presentation.name} onChange={(e) => setPresentation({name: e.target.value, description: presentation.description})} placeholder="Presentation Name" />
                    </div>
                    <div className="form-group">
                    <CKEditor
                        editor={ ClassicEditor }
                        data={presentation.description}
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                        } }
                        onChange={( event, editor ) => {
                                const data = editor.getData();
                                setPresentation({name: presentation.name, description: data});
                            } 
                        }
                        
                    />
                    </div>
                    <button type="button" onClick={handleUpdate} className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
        </div>
    )

}

export default CreatePresentation;