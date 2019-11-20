import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {ReactMic} from 'react-mic';
import { confirmAlert } from 'react-confirm-alert';
import {usePageImageReplace} from '../hooks/pages/usePageImageReplace';
import {useUploadAudio} from '../hooks/pages/useUploadAudio';
import {usePageAudioRemove} from '../hooks/pages/usePageAudioRemove';
import Loader from '../Loader/Loader';
import 'react-confirm-alert/src/react-confirm-alert.css';

function PresentationEditPage(props) {
    const [imageError, setImageError] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showRecording, setShowRecording] = useState(false);

    //states for recording audio
    const [isRecording, setIsRecording] = useState(false);
    const [blobURL, setBlobURL] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [uploadingAudio, setUploadingAudio] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
            setIsBlocked(false);
        }).catch((err) => {
            setIsBlocked(true);
        });
    },[]);
    
    const {
        className,
        editPage,
        toggleEdit,
        editPageDetail,
        pageUpdated
    } = props;
    const fileUploadRef = useRef(null);
    const audioRef = useRef(null);
    const handleFileDialog = (e) => {
        fileUploadRef.current.click();
    }
    const handleShowRecording = () => {
        setShowRecording(!showRecording);
    }

    const handleSaveAudio = () => {
        if(recordedBlob) {
            setShowRecording(false);
            setUploadingAudio(true);
            useUploadAudio(recordedBlob, editPageDetail.presentation_id, editPageDetail.id).then((response) => {
                if(response.status === 200) {
                    setUploadingAudio(false)
                    pageUpdated(response.data);
                }
            }).catch((err) => {
                if(err.response && err.response.status === 403) {
                    props.history.push('/');
                }
            })
        }
    }
    const handleConfirmDelete = (message, cb) => {
        confirmAlert({
            title: 'Confirm Delete',
            message,
            buttons: [
              {
                label: 'Yes',
                onClick: () => cb()
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          })
    }
    const handleAudioDelete = () => {
        usePageAudioRemove(editPageDetail.id, editPageDetail.presentation_id).then((response) => {
            if(response.status === 200) {
                pageUpdated(response.data);
            }
        }).catch((err) => {
            if(err.response && err.response.status === 403) {
                props.history.push('/');
            }
        })
    }
    const handleFileUpload = (e) => {
        setImageError(null);
        if(e.target.files.length > 0) {
            const uploadedFile = e.target.files[0];
            if(uploadedFile.type != 'image/jpeg' && uploadedFile.type != 'image/png') {
                setImageError('Invalid file type. Only .jpg or .png files allowed.');
                fileUploadRef.current.value = '';
                return false;
            }
            setUploadingImage(true);
            usePageImageReplace(uploadedFile, editPageDetail.id, editPageDetail.presentation_id).then((response) => {
                fileUploadRef.current.value = '';
                if(response.status === 200) {
                    pageUpdated(response.data);
                }
                setUploadingImage(false);
            }).catch((err) => {
                if(err.response && err.response.status === 403) {
                    props.history.push('/');
                }
            });

        }
    }
    const toggleRecording = () => {
        if(!isBlocked) {
            if(!isRecording) {
                setShowSaved(false);
            }
            setIsRecording(!isRecording);
        }
    }
    const onReceiveData = (rBlob) => {
       
    } 
    const onStopRecording = (blob) => {
        var fileObject = new File([blob.blob], 'audio.mp3', {
            type: 'audio/mpeg-3'
        });
        setShowSaved(true);
        setRecordedBlob(fileObject);
        setBlobURL(blob.blobURL);
    }
    
    return (
        <div>
            <Modal isOpen={editPage} toggle={toggleEdit} className={className}>
                <ModalHeader toggle={toggleEdit}>Edit Page</ModalHeader>
                <ModalBody>
                    {
                        imageError ?
                        <div className="alert alert-danger">{imageError}</div>
                        : null
                    }
                    {
                        uploadingImage ? <Loader /> : null
                    }
                    {
                        editPageDetail ?
                        <div className="card-secondary">
                            <div className="cs-img">
                                <img src={`/storage/presentations/${editPageDetail.presentation_id}/${editPageDetail.image}`} alt="" />
                                {
                                    !uploadingImage ?
                                    <div className="cs-img-links">
                                        <a onClick={handleFileDialog} className="dlt-img">
                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                    : null 
                                }
                                <input type="file" id="file" ref={fileUploadRef} style={{display: "none"}} onChange={handleFileUpload}/>
                            </div>
                            <div className="cs-content">
                                <div className="card-audio">
                                    {
                                        editPageDetail.audio ? 
                                        <audio src={`/storage/presentations/${editPageDetail.presentation_id}/${editPageDetail.audio}`} controls="controls"/>
                                        : null
                                    }
                                </div>
                                <div className="cs-audio-links">
                                    {
                                        editPageDetail && editPageDetail.audio ?
                                        <a onClick={handleConfirmDelete.bind(null, 'Are you sure you want to remove audio?', handleAudioDelete)} className="add-img">
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a>
                                        :
                                        null
                                    }
                                    
                                    <a onClick={handleShowRecording} className="dlt-img">
                                        <i className="fa fa-microphone" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </ModalBody>
                <ModalFooter>
                    {
                        showRecording ?
                        <div className="canvas-warap">
                            <div>
                                <audio ref={audioRef} src={blobURL} controls="controls"/>
                                {
                                    showSaved ?
                                    <button type="button" className="active" onClick={handleSaveAudio}><i className="fa fa-save" aria-hidden="true"></i></button>

                                    : null
                                }
                            </div>
                            <ReactMic
                                record={isRecording}
                                className="sound-wave"
                                onStop={onStopRecording}
                                onData={onReceiveData}
                                strokeColor="#000000"
                                backgroundColor="#f2f3f4" />
                            <div>
                                <button onClick={toggleRecording} type="button" className={isRecording ? '' : 'active'} disabled={isRecording ? true: false}><i className="fa fa-microphone" aria-hidden="true"></i></button>
                                <button onClick={toggleRecording} type="button" className={!isRecording ? '' : 'active'} disabled={!isRecording ? true: false}><i className="fa fa-stop" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        : uploadingAudio ? <Loader /> : null
                    }
                
                </ModalFooter>
            </Modal>
        </div>
    )

}

export default PresentationEditPage;