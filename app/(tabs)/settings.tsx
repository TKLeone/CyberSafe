import React, { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"

// TODO: potentially add colour themes
const App = () => {
  const [email, setEmail] = useState<string>("")
  const [ageRange, setAgeRange] = useState<string>("")
  const [gender, SetGender] = useState<string>("")

  useEffect(()=> {
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
    gender: string
  }

  const getAccountInfo = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/getAccountInfo", {token})
      const {email, ageRange, gender } = response.data as userData
      setEmail(email)
      setAgeRange(ageRange)
      SetGender(gender)

    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 500) {

      }
    }
  }

  // NOTE: add an effect when they long press so they know what they're doing
  // or add a tooltip telling them what to do
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logOutContainer}>
        <Text style={styles.logOutText}>Log out your account... </Text>
        <Pressable style={styles.buttons} onPress={() => logOut()}>
          <Text> Log out </Text>
        </Pressable>
      </View>
      <View style={styles.deleteAccountContainer}>
        <Text style={styles.deleteAccountText}> Delete your account... </Text>
        <Pressable style={styles.buttons} delayLongPress={2000} onLongPress={() => deleteAccount()}>
          <Text> Delete Account </Text>
        </Pressable>
      </View>
      <View style={styles.accountInfoContainer}>
        <Text> Account Information...</Text>
        <Text> {email}</Text>
        <Text> {ageRange}</Text>
        <Text> {gender}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#212121",
  },
  logOutContainer: {
    position:"absolute",
    top: 100,
    width: "100%",
  },
  buttons: {
    width: "80%",
    padding: 10,
    backgroundColor: "#A9A9A9",
    color: "red",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
  },
  logOutText: {},
  deleteAccountContainer: {
    position: "absolute",
    top: 200,
    width: "100%"
  },
  deleteAccountText: {

  },
  accountInfoContainer: {
    position: "absolute",
    top: 400,
    width: "100%"
  }
})
export default App
