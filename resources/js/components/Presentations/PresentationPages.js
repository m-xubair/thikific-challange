import React, { useState, useEffect, useCallback, useRef } from 'react';
import {Link} from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import { confirmAlert } from 'react-confirm-alert';
import {sortableContainer} from 'react-sortable-hoc';
import {useUploadPdf} from '../hooks/pages/useUploadPdf';
import {usePresentationPages} from '../hooks/pages/usePresentationPages';
import {usePageDelete} from '../hooks/pages/usePageDelete';
import {usePageSortOrder} from '../hooks/pages/usePageSortOrder';
import {useAddNewPage} from '../hooks/pages/useAddNewPage';
import PresentationPage from './PresentationPage';
import PresentationEditPage from './PresentationEditPage';
import Loader from '../Loader/Loader';

function PresentationPages(props) {
    const presentationID = props.match.params.id;
    const [presentation, setPresentation] = useState(null);
    const [loadingPages, setLoadingPages] = useState(true);
    const [editPage, setEditPage] = useState(false);
    const [editLoader, setEditLoader] = useState(false);
    const [editPageDetail, setEditPageDetail] = useState(null);
    const [pdfError, setPdfError] = useState(null);
    const [uploadingPDF, setUploadingPDF] = useState(false);
    const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
    const [disableSorting, setDisableSorting] = useState(true);
    const [updatingPage, setUpdatingPage] = useState(false);
    const [imageError, setImageError] = useState('');

    const newImageUpload = useRef(null);

    const toggleEdit = (editID) => {
        const editPageFilter = presentation.pages.filter((p) => p.id === editID);
        setEditPageDetail(editPageFilter.length > 0 ? editPageFilter[0] : null);
        setEditPage(!editPage)
    };

    const handleNewImageDialog = () => {
        newImageUpload.current.click();
    }

    const handleNewImageUpload = (e) => {
        setImageError(null);
        if(e.target.files.length > 0) {
            const uploadedFile = e.target.files[0];
            if(uploadedFile.type != 'image/jpeg' && uploadedFile.type != 'image/png') {
                setImageError('Invalid file type. Only .jpg or .png files allowed.');
                fileUploadRef.current.value = '';
                return false;
            }
            setIsUploadingNewImage(true);
            useAddNewPage(uploadedFile, presentationID).then((response) => {
                if(response.status == 200) {
                    pageAdded(response.data);
                }
                setIsUploadingNewImage(false);
                fileUploadRef.current.value = '';

            }).catch((err) => {
                setIsUploadingNewImage(false);
                if(err.response && err.response.status === 403) {
                    props.history.push('/');
                }
            });

        }
    }
    const onDrop = useCallback(acceptedFile => {
        // Do something with the files
        if(acceptedFile.length > 0) {
            setUploadingPDF(true);
            useUploadPdf(acceptedFile[0], presentationID).then((response) => {
                setUploadingPDF(false);
                setPresentation(response.data);
            }).catch((err) => {
                setUploadingPDF(false);
                if(err.response) {
                    if(err.response.status === 400) {
                        props.history.push('/')
                    }
                    if(err.response.status === 403) {
                        setPdfError(err.response.data.error);
                    }
                }
            })
        }
    }, []);

    const pageAdded = (page) => {
        setPresentation(prevState => ({...prevState, pages: [...prevState.pages, page]}));
    }
    const pageUpdated = (page) => {
        const foundPage = presentation.pages.findIndex(x => x.id == page.id);
        presentation.pages[foundPage] = page;
        setEditPageDetail(page);
        setPresentation(presentation);

    }

    const SortableContainer = sortableContainer(({children}) => {
        return <div className="row">{children}</div>;
    });

    const handledisableSorting = () => {
        setDisableSorting(false);
    }

    const onSortEnd = ({oldIndex, newIndex}) => {
        if(oldIndex === newIndex) return;
        const tmp = presentation.pages[oldIndex];
        let p = moveArray(presentation.pages, oldIndex, newIndex);


        setPresentation(prevState => ({...prevState, pages: p}));
    }

    const handleSaveSorting = () => {
        setUpdatingPage(true);
        const sortOrder = presentation.pages.reduce((acc, it,idx) => [...acc, [{id: it.id, sort: idx+1}]], []);

        usePageSortOrder(sortOrder, presentationID).then((response) => {
            setDisableSorting(true);
            setUpdatingPage(false);
        }).catch((err) => {
            if(err.response && err.response.status == 403) {
                props.history.push('/');
            }
        });
    }

    const moveArray = (arr, old_index, new_index) => {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };

    const handlePageDelete = (message, cb, id) => {
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

    const doPageDelete = (id) => {
        setUpdatingPage(true)
        usePageDelete(id, presentationID).then((response) => {
            if(response.status == 200) {
                const pages = presentation.pages.filter((p) => p.id != id);
                setPresentation(prevState => ({...prevState, pages: [...pages]}));
                setUpdatingPage(false);
            }
        }).catch((err) => {
            if(err.response && err.response.status === 403) {
                props.history.push('/');
            }
        });
    }

    //get presentation & pages
    useEffect(() => {
        usePresentationPages(presentationID).then((data) => {
            setPresentation(data);
            setLoadingPages(false);
        }).catch((err) => {
            if(err.response && err.response.status === 403) {
                props.history.push('/');
            }
        });
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: 'application/pdf', multiple: false})
    return (
        <div className="dashboard-section">
            <div className="container">
            <div className="button-container">
                {
                    disableSorting ?
                    <a onClick={handledisableSorting} className="create-link"> <i className="fa fa-sort"></i> Enable Sorting</a>
                    :null
                }
                <Link to={`/presentation/${presentationID}/preview`} className="create-link"> <i className="fa fa-eye"></i> Preview</Link> 
                <a href={`/presentation/${presentationID}/export`} target="_blank" className="create-link"> <i className="fa fa-file-archive-o"></i> Export</a>                
                <Link to={`/presentation/${presentationID}/edit`} className="create-link"> <i className="fa fa-arrow-left"></i> Go Back</Link>
            </div>
            {
                pdfError ? 
                <div className="alert alert-danger">{pdfError}</div>
                :null
            }
            <div {...getRootProps()} className="drag-drop-container">
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>
                        <i className="fa fa-upload"></i><br />
                        Drag 'n' drop PDF file here, or click to select PDF file.</p>
                }
            </div>
            {
                !disableSorting ? 
                <div className="sorting-content">
                    <span>Drag & drop pages to sort.</span>
                    {
                        updatingPage ? null
                        :
                        <div className="sc-btn">
                            <input type="button" onClick={handleSaveSorting} value="Save Sorting" />
                            <input type="button" onClick={() => { setDisableSorting(true) }} value="Cancle" />                        
                        </div>
                    }

                </div>
                :null
            }
            {
                uploadingPDF || updatingPage ? <Loader /> : null
            }    

            <SortableContainer onSortEnd={onSortEnd} axis="xy">
            {
                presentation ?
                    presentation.pages.map((page, i) => <PresentationPage 
                    disabled={disableSorting} page={page} key={page.id} index={i} value={page.id} 
                    handlePageDelete={handlePageDelete} toggleEdit={toggleEdit} pageNumber={i+1}
                    doPageDelete={doPageDelete} isDisabled={disableSorting}/> )
                : null
            }
            {
                presentation && presentation.pages.length < 20 ?
                <div className="col-lg-3 col-sm-6" disabled={true}>
                    <div className="card">
                    {
                        isUploadingNewImage ?
                            <Loader />
                        :
                        <a onClick={handleNewImageDialog} className="add-card">    
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            <span>add image</span>
                        </a>
                    }
                    </div>
                    <input type="file" ref={newImageUpload} style={{display: 'none'}}  onChange={handleNewImageUpload}/>
                </div>
                : null
            }
            </SortableContainer>
            
            

            { loadingPages ? <Loader /> : null }
            </div>
            <PresentationEditPage editPage={editPage} toggleEdit={toggleEdit} editLoader={editLoader} editPageDetail={editPageDetail}
            pageUpdated={pageUpdated} />
        </div>
    )

}

export default PresentationPages;