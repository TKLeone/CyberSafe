import {Image, Text, SafeAreaView, StyleSheet, Pressable} from "react-native"
import {router} from "expo-router"
import validateJWT from "./Authentication/validateJWT"
import React, {useCallback, useEffect} from "react"
import { useFonts} from "expo-font"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

const HomePage = () => {
  useEffect(() => {
    validateJWT(true)
  }, [])

  const [fontsLoaded, fontError] = useFonts({
    "OpenSansBold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("./assets/fonts/OpenSans-Regular.ttf"),
  })
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  const goToLogin = () =>{
    router.navigate("/Authentication/Login")
  }

  const goToRegister = () =>{
    router.navigate("/Authentication/Register")
  }

  return (
    <SafeAreaView style={styles.root} onLayout={onLayoutRootView}>
      <Image 
        style={styles.image}
        source={require("./assets/CyberSafe.png")}
      />
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
    backgroundColor: "#181b20",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 350,
    top: 40,
    resizeMode: "cover",
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
    fontSize: 20,
    textAlign: "center",
    fontFamily: "OpenSansBold"
  },
})

export default HomePage
