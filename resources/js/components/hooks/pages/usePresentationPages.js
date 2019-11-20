import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePresentationPages = (presentationID) => {
    return new Promise((resolve, reject) => {
        Axios.get(`/api/pages/${presentationID}`, useAuthHeader())
        .then((response) => {
            if(response.status === 200) {
                resolve(response.data);
            }
        }).catch((err) => {
            reject(err);
        });    
    })
}