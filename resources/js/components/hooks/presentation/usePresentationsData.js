import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePresentationsData = () => {
    return new Promise((resolve, reject) => {
        Axios.get('/api/presentations', useAuthHeader())
        .then((response) => {
            if(response.status === 200) {
                resolve(response.data);
            }
        }).catch((err) => {
            reject(err.response);
        });
    });
}