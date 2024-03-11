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
        <LinearGradient 
          colors={['#333333', '#000000']}
          style={styles.linearGradient}>
        <Text style={styles.buttonText}> Register </Text>
        </LinearGradient>
      </Pressable>
      <Pressable style={[styles.button, {marginTop: 20}]} onPress={goToLogin}>
        <LinearGradient 
          colors={['#333333', '#000000']}
          style={styles.linearGradient}>
        <Text style={styles.buttonText}> Log in </Text>
        </LinearGradient>
      </Pressable>
    </SafeAreaView>  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "cream",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '70%',
  },
  linearGradient: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
})

export default HomePage;
