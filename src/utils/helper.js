export const getQueryParameter = (parameterName) => {
    const url = window.location.href;
    const queryString = url.split('?')[1]?.split('#')[0];
    if (!queryString) {
        return null;
    }
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(parameterName);
}