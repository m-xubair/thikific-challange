import Axios from 'axios';
const options = {
    headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
};
export const usePresentationsData = () => {
    return Axios.get('/api/presentations', options);
    
}