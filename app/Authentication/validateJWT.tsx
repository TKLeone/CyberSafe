import {router} from "expo-router"
import axios, {AxiosError} from "axios"
import * as SecureStore from "expo-secure-store"

const validateJWT = async (index: boolean) => {
    try {
        const token = await SecureStore.getItemAsync("jwt")
        const response = await axios.post("http://192.168.1.100:8001/validateJWT", {token},{withCredentials: true})
        if (response.status === 200 && index) {
            router.navigate("topics")
        }
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
