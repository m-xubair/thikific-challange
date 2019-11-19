import Axios from 'axios';
const options = {
    headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
};
export const usePresentationData = (id) => {
    return Axios.get(`/api/presentations/${id}/edit`, options);
    
}