import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePageImageReplace = (file, pageID, presentationID) => {
    const additionalHeaders = 'multipart';
    const formData = new FormData();
    formData.append("file", file);
    formData.append("presentation_id", presentationID);
    console.log('FOrmData::', formData);

    return Axios.post(`/api/pages/${pageID}`, formData, useAuthHeader(additionalHeaders));
    
}