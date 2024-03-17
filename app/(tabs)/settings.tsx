import React from "react"
import axios, { AxiosError } from "axios"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"

// TODO: add delete account
// TODO: potentially add colour themes
// TODO: add account information
const App = () => {

  const logOut = async () => {
    try {
      const response = await axios.get("http://192.168.1.100:8001/Logout", {withCredentials: true})
      if (response.status === 200) {
        router.replace("/")
      } else if (response.status === 205) {
        router.replace("/")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if(axiosError.response && axiosError.response.status === 500){
        // NOTE: do something
      }
    }
  }

  const deleteAccount = async () => {
    try {
      const response = await axios.get("http://192.168.1.100:8001/deleteaccount", {withCredentials: true})
      if (response.status === 200) {
        router.replace("/")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status) {
        // NOTE: add the pop up
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logOutContainer: {
    position:"absolute",
    top: 100,
    width: "100%",
  },
  buttons: {
    width: "80%",
    padding: 10,
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

  }
})
export default App
