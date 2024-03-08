import {router} from "expo-router"
import axios, {AxiosError} from "axios"

// TODO: use expo-secure-store instead of cookies because fuck me man

const validateJWT = async (index: boolean) => {
    try {
        const response = await axios.post("http://192.168.1.100:8001/validateJWT", {},{withCredentials: true})
    } catch (err) {
        const axiosError = err as AxiosError
        if (axiosError.response && axiosError.response.status === 401) {
            if(!index){
                router.replace("Authentication/Login")
            }
        }
    }
}

export default validateJWT
