import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePresentationDelete = (id) => {
    return Axios.delete(`/api/presentations/${id}`, useAuthHeader());
    
}