import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePageDelete = (id, presentationID) => {

    return Axios.delete(`/api/pages/${id}?presentation_id=${presentationID}`, useAuthHeader());
    
}