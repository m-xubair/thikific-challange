export const useAuthHeader = () => {
    return {
        headers: {'Authorization': 'Bearer '+localStorage.getItem('_token')}
    };
}