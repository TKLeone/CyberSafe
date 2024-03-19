import {Text, SafeAreaView, StyleSheet, Pressable} from "react-native";
import {router} from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'
import validateJWT from "./Authentication/validateJWT"
import {useEffect} from 'react'


const HomePage = () => {

  useEffect(() => {
    validateJWT(true)
  }, [])

  const goToLogin = () =>{
    router.navigate("/Authentication/Login")
  }

  const goToRegister = () =>{
    router.navigate("/Authentication/Register")
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text> Home Page</Text>
      <Pressable style={styles.button} onPress={goToRegister}>
        <Text style={[styles.buttonText]}> Register </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={goToLogin}>
        <Text style={[styles.buttonText]}> Log in </Text>
      </Pressable>
    </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#212121",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "60%",
    height: 50,
    backgroundColor: "#FF954F",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    position: "absolute",
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
})

export default HomePage;
