import Axios from 'axios';
const options = {
    headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
};
export const usePresentationCreate = (data) => {
    return Axios.post(`/api/presentations`, data, options);
    
}