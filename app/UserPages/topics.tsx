import {router} from "expo-router"
import React, { useEffect } from "react"
import {Text, SafeAreaView, Pressable, StyleSheet, View } from "react-native"
import validateJWT from "../Authentication/validateJWT"

interface buttonData {
  importance: number,
  label: string,
}

const buttons: buttonData[] = [
  {importance: 1, label: "Phishing"},
  {importance: 2, label: "Cyber-bulling"},
  {importance: 2, label: "Cyber-bulling"},
  {importance: 2, label: "Cyber-bulling"},
  {importance: 2, label: "Cyber-bulling"},
  {importance: 2, label: "Cyber-bulling"}
]

const App = () => {
  useEffect(() => {
    console.log("topics page validation triggers")
    validateJWT(false)
  },[])

  const sortedButtons = buttons.slice().sort((a,b) => a.importance - b.importance)

  const handleClick = () => {
    router.navigate("/topics")
  }
  // TODO: do CSS for the buttons, figure out way to get different topics
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
      {sortedButtons.map((button, index) => (
        <Pressable key={index} onPress={() => handleClick()} style={styles.button}>
          <Text>{button.label}</Text>
        </Pressable>
      ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 10, 
  },
  button: {
    width: 175,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
})

export default App
