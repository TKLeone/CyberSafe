import {router} from "expo-router"
import React from "react"
import axios, { AxiosError } from "axios"
import {Text, SafeAreaView, Pressable } from "react-native"

const validateJWT = async () => {
  try {
    const response = await axios.post("http://localhost:8001/validateJWT", {},{withCredentials: true})
  } catch (err) {
    const axiosError = err as AxiosError
    if (axiosError.response && axiosError.response.status === 401) {
      router.replace("Authentication/Login")
    }
  }
}

interface buttonData {
  importance: number,
  label: string,
  link: string,
}

const buttons: buttonData[] = [
  {importance: 1, label: "Phishing", link: "/topics"},
  {importance: 2, label: "Cyber-bulling", link: "/topics"}

]

const App = () => {
  validateJWT()
  const sortedButtons = buttons.slice().sort((a,b) => a.importance - b.importance)

  const handleClick = () => {
    router.navigate("/topics")
  }

  return (
    <SafeAreaView>
      {sortedButtons.map((button, index) => (
        <Pressable key={index} onPress={() => handleClick()}>
          <Text>{button.label}</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  )
}

export default App
