export const useAuthHeader = (contentType) => {
    let apiHeaders = {
        headers: {
            'Authorization': 'Bearer '+localStorage.getItem('_token'),
        }
    };

    apiHeaders.headers['Content-Type'] = contentType ? 'multipart/form-data' : 'application/json';

    return apiHeaders;
}