import {Text, SafeAreaView, StyleSheet, View, Pressable} from "react-native";
import {router} from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'

const HomePage = () => {

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
    backgroundColor: "cream", // Change background color to cream
    flex: 1, // Ensure the container takes the entire space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  button: {
    width: '70%', // Set the width to 70% of the container
  },
  linearGradient: {
    borderRadius: 10, // Adjust border radius for less rounded corners
    paddingVertical: 15, // Add vertical padding for button height
    paddingHorizontal: 30, // Add horizontal padding for button width
  },
  buttonText: {
    color: 'white', // Set button text color to white
    fontWeight: 'bold', // Apply bold font weight
    fontSize: 18, // Set font size
    textAlign: 'center', // Center text horizontally
  },
})

export default HomePage;
