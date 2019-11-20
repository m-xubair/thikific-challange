import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const useUploadAudio = (file, presentationID, pageID) => {
    const additionalHeaders = 'multipart';
    const formData = new FormData();
    formData.append("file", file);
    formData.append("presentation_id", presentationID);
    return Axios.post(`/api/pages/${pageID}/audio`, formData, useAuthHeader(additionalHeaders));
    
}