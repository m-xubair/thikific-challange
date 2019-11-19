import Axios from 'axios';
const options = {
    headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
};
export const usePresentationDelete = (id) => {
    return Axios.delete(`/api/presentations/${id}`, options);
    
}