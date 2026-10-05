let _accessToken = null
export const setAccessToken = (token) =>{
    _accessToken = token
}
export const getAccessToken = () =>{
    return _accessToken
}
export const removeAccessToken = () =>{
    _accessToken = null
}