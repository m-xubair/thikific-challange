import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';

export const usePresentationData = (id) => {
    return Axios.get(`/api/presentations/${id}/edit`, useAuthHeader());
    
}