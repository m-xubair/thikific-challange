import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';

export const usePresentationEdit = (id, data) => {
    return Axios.put(`/api/presentations/${id}`, data, useAuthHeader());
    
}