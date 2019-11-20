import Axios from 'axios';
import { useAuthHeader } from '../useAuthHeader';
export const usePageSortOrder = (sortOrder, presentationID) => {
    return Axios.post(`/api/pages/sort`, {sort_order: sortOrder, presentation_id: presentationID }, useAuthHeader());
    
}