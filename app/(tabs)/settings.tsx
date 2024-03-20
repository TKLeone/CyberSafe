import React, { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"
import validateJWT from "../Authentication/validateJWT"

const App = () => {
  const [email, setEmail] = useState<string>("")
  const [ageRange, setAgeRange] = useState<string>("")

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })


  useEffect(()=> {
    validateJWT(false)
    getAccountInfo()
  })

  const logOut = async () => {
    try {
        await SecureStore.deleteItemAsync("jwt")
        router.replace("/")
    } catch (err) {
      const axiosError = err as AxiosError
      if(axiosError.response && axiosError.response.status === 500){
        // NOTE: do something
      }
    }
  }

  const deleteAccount = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/deleteaccount", {token},{withCredentials: true})
      if (response.status === 200) {
        await SecureStore.deleteItemAsync("jwt")
        router.replace("/")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status) {
        // NOTE: add the pop up
      }
    }
  }

  interface userData {
    email: string,
    ageRange: string,
  }

  const getAccountInfo = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/getAccountInfo", {token})
      const {email, ageRange} = response.data as userData
      setEmail(email)
      setAgeRange(ageRange)

    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 500) {

      }
    }
  }

  const deleteResponses = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/deleteResponse", {token})

    } catch (err) {
      const axiosError = err as AxiosError

      if (axiosError.response && axiosError.response.status === 500) {

      }
    }
  }

  // NOTE: add an effect when they long press so they know what they're doing
  // or add a tooltip telling them what to do
  // TODO: popup when you delete account and delete response
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logOutContainer}>
        <Text style={styles.logOutText}>Log out your account </Text>
        <Pressable style={styles.buttons} onPress={() => logOut()}>
          <Text style={{fontFamily: "OpenSansBold", fontSize: 15, color: "white"}}> Log out </Text>
        </Pressable>
      </View>
      <View style={styles.deleteAccountContainer}>
        <Text style={styles.deleteAccountText}> Delete your account</Text>
        <Pressable style={styles.buttons} delayLongPress={2000} onLongPress={() => deleteAccount()}>
          <Text style={{fontFamily: "OpenSansBold", fontSize: 15, color: "white"}}> Delete Account </Text>
        </Pressable>
      </View>
      <View style={styles.accountInfoContainer}>
        <Text style={{fontFamily: "OpenSansBold", fontSize: 20,color: "#FF954F", marginBottom: 5}}> Account Information</Text>
        <View style={styles.accountInfo}>
        <Text style={{fontFamily: "OpenSansBold", fontSize: 18, color: "white", padding: 10}}>E-mail: {email}</Text>
        <Text style={{fontFamily: "OpenSansBold", fontSize: 18, color: "white", padding: 10}}>Age Range: {ageRange}</Text>
        </View>
      </View>
      <View style={styles.deleteResponsesContainer}>
        <Text style={styles.deleteResponsesText}>Delete Responses</Text>
        <Pressable style={styles.buttons} onPress={() => deleteResponses()}>
          <Text style={{fontFamily: "OpenSansBold", fontSize: 15, color: "white"}}> Delete Responses </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b20",
  },
  logOutContainer: {
    position:"absolute",
    top: 100,
    width: "100%",
    left: 10,
  },
  buttons: {
    width: "80%",
    padding: 10,
    backgroundColor: "#445565",
    color: "red",
    borderRadius: 8,
  },
  logOutText: {
    fontFamily: "OpenSansBold",
    fontSize: 18,
    color: "#FF954F",
    marginBottom: 5,
  },
  deleteAccountContainer: {
    position: "absolute",
    top: 200,
    width: "100%",
    left: 10,
  },
  deleteAccountText: {
    fontFamily: "OpenSansBold",
    fontSize: 20,
    color: "#FF954F",
    marginBottom: 5,
  },
  accountInfoContainer: {
    position: "absolute",
    top: 300,
    width: "80%",
    left: 10,
  },
  accountInfo: {
    borderRadius: 8,
    backgroundColor: "#445565",
    marginBottom: 5,
  },
  deleteResponsesContainer: {
    position: "absolute",
    top: 450,
    width: "80%",
    left: 10,
  },
  deleteResponsesText: {
    fontFamily: "OpenSansBold",
    fontSize: 20,
    color: "#FF954F",
    marginBottom: 5,
  },
})
export default App
