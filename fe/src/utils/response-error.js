export const responseError = ({error , msg})=>{
    return error.response?.data?.message || error.message || msg
}