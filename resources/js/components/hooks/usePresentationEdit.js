import Axios from 'axios';
const options = {
    headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
};
export const usePresentationEdit = (id, data) => {
    return Axios.put(`/api/presentations/${id}`, data, options);
    
}