import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet, Pressable, TextInput, Keyboard} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import { FontAwesome } from "@expo/vector-icons"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"

const App = () => {
  const [question, setQuestion] = useState<string>("")
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [response, setResponse] = useState<string>("Waiting for question...")
  const [showServerError, setShowServerError] = useState<boolean>(false)

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

  useEffect(() => {
    validateJWT(false)
  })

  const sendQuestion = async () => {
    if (question === "") {
      return setResponse("Ask a question")
    }
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const sentData = {
        question: question,
        token
      }
      setQuestion("")
      Keyboard.dismiss
      const response = await axios.post("http://192.168.1.100:8001/api/openAI", sentData)
      setShowServerError(false)
      setResponse(response.data)
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 400) {
        setShowServerError(true)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          editable
          style={styles.askBox}
          onChangeText={setQuestion}
          placeholder="Ask a question... "
          value={question}
          autoFocus={isFocused}
          onFocus={() => setIsFocused(true)}
        />
        <Pressable style={styles.enterButton} onPress={sendQuestion}>
          <FontAwesome name="arrow-circle-right" size={30} color="#181b20" />
        </Pressable>
      </View>
      <ScrollView 
        style={styles.responseScrollView} 
        contentContainerStyle={styles.responseContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={{fontFamily: "OpenSansBold", fontSize: 15, color: "white"}}> {response} </Text>
        </View>
      </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181b20",
  },
  inputContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    marginBottom: 10,
    position: "relative",
    width: "90%",
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
  askBox: {
    flex: 1,
    height: 50,
    backgroundColor: "#A9A9A9",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    fontFamily: "OpenSansBold",
    fontSize: 15
  },
  enterButton: {
    position: "absolute", 
    right: 10, 
    zIndex: 1,
  },
  responseScrollView: {
    flex: 2,
  },
  responseContainer: {
    width: "90%",
    backgroundColor: "#445565",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FF954F",
    
  },
})

export default App
