import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet, Pressable, TextInput} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import { FontAwesome } from '@expo/vector-icons'
import * as SecureStore from "expo-secure-store"


const App = () => {
  const [question, setQuestion] = useState<string>("")
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [response, setResponse] = useState<string>("")
  useEffect(() => {
    validateJWT(false)
  })

  const sendQuestion = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const sentData = {
        question: question,
        token
      }
      setQuestion("")
      const response = await axios.post("http://192.168.1.100:8001/api/openAI", sentData)
      setResponse(response.data)
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 400) {
        // NOTE: add the server error pop up
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.askBox}
          onChangeText={setQuestion}
          placeholder="Ask a question... "
          value={question}
          autoFocus={isFocused}
          onFocus={() => setIsFocused(true)}
        />
        <Pressable style={styles.enterButton} onPress={sendQuestion}>
          <FontAwesome name="arrow-circle-right" size={30} color="black" />
        </Pressable>
      </View>
      <ScrollView 
        style={styles.responseScrollView} 
        contentContainerStyle={styles.responseContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text> {response} </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
// TODO:  fix css for whole page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212121",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    position: "relative",
    height: 50,
  },
  askBox: {
    flex: 1,
    top: 40,
    width: "90%",
    height: 50,
    backgroundColor: "#A9A9A9",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
  },
  enterButton: {
  },
  responseScrollView: {
    flex: 2,
  },
  responseContainer: {
    width: "90%",
    backgroundColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "black",
  }

})
export default App