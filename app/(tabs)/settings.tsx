import React, { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"
import validateJWT from "../Authentication/validateJWT"
import { FontAwesome } from "@expo/vector-icons"

const App = () => {
  const [email, setEmail] = useState<string>("")
  const [ageRange, setAgeRange] = useState<string>("")
  const [showServerError, setShowServerError] = useState<boolean>(false)

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
        setShowServerError(false)
        router.replace("/")
    } catch (err) {
      const axiosError = err as AxiosError
      if(axiosError.response && axiosError.response.status === 500){
        setShowServerError(true)
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
      setShowServerError(false)
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status) {
        setShowServerError(true)
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
      setShowServerError(false)
      const {email, ageRange} = response.data as userData
      setEmail(email)
      setAgeRange(ageRange)

    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 500) {
        setShowServerError(true)
      }
    }
  }

  const deleteResponses = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      await axios.post("http://192.168.1.100:8001/deleteResponse", {token})
      setShowServerError(true)
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 500) {
        setShowServerError(true)
      }
    }
  }

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
        <View style={styles.deleteTipContainer}>
          <FontAwesome style={styles.infoCircle} name="info-circle" size={16} color="black" top={5} />
          <Text style={styles.deleteTip}> Hold for 2 seconds </Text>
        </View>
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
      {showServerError && (
        <View style={styles.serverError}>
          <FontAwesome style={styles.serverVector} name="server" size={24} color="black" />
          <Text> An error has occured </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b20",
  },
  serverError: {
    position: "absolute",
    width: "60%",
    height: 225,
    backgroundColor: "red",
    top: 200,
    borderRadius: 10,
  },
  serverVector: {
    position: "absolute",
    alignSelf: "center",
    top: 60,
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
  deleteTipContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "red",
    width: "80%",
    opacity: 0.65,
    marginBottom: 5,
    padding: 2,
  },
  infoCircle: {
    top: 0,
  },
  deleteTip: {
    marginLeft: 4,
    fontFamily: "OpenSansBold",
    fontSize: 13,
    width: "80%",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
  },
  accountInfoContainer: {
    position: "absolute",
    top: 350,
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
    top: 500,
    width: "100%",
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
