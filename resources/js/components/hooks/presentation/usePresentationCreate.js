import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePresentationCreate = (data) => {
    return Axios.post(`/api/presentations`, data, useAuthHeader());
    
}