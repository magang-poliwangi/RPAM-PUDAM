export const responseError = ({error , msg})=>{
    return error.response?.data?.message || error.message || msg
}

export const getPayload = (response) => response?.data?.data ?? response?.data ?? response;