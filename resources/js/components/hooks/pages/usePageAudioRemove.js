import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePageAudioRemove = (pageID, presentationID) => {

    return Axios.put(`/api/pages/${pageID}/delete/audio`, {presentation_id: presentationID}, useAuthHeader());
    
}