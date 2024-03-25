import axios, { AxiosError } from "axios"
import { Entypo } from "@expo/vector-icons"
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput} from "react-native"
import {router} from "expo-router"
import validator from "validator"
import * as Securestore from "expo-secure-store"
import { useFonts} from "expo-font"

const UserForm = () => {
  const[email, setEmail] = React.useState<string>("")
  const[password, setPassword] = React.useState<string>("")
  const[emailError, setEmailError] = React.useState<string>("")
  const[passwordError, setPasswordError] = React.useState<string>("")

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

  const handleLogin = async () => {
    let hasErrors: boolean = false
    if (!password) {
      setPasswordError("Password is required") 
      hasErrors = true
    }
    if (!email) {
      setEmailError("E-mail is required")
      hasErrors = true
    }
    if (!validateEmail(email)) {
      setEmailError("E-mail is not in a valid format")
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    const data = JSON.stringify({
      email: email,
      password: password,
    })

    try {
      const response = await axios.post("http://192.168.1.100:8001/login", data, {headers: {"Content-Type": "application/json"}, withCredentials: true})
      if (response.status === 200) {
        const token = response.data
        await Securestore.setItemAsync("jwt", token)
        router.replace("topics")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 401) {
        setPasswordError("Password or email is wrong")
      }
    }
  }

  const handleEmailChange = (value: string) => {
    setEmailError("")
    setEmail(value)
  }

  const handlePasswordChange = (value: string) => {
    setPasswordError("")
    setPassword(value)
  }

  const validateEmail = (email: string): boolean => {
    return validator.isEmail(email)
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.inputContainer}>
        <Pressable style={styles.quitButton} onPress={() => router.navigate("/")}>
          <Entypo name="circle-with-cross" size={35} color="#FF954F" />
        </Pressable>
        <Text style={{fontFamily: "OpenSansBold", fontSize: 30, color:"#FF954F"}}> Login </Text>
        <Text style={styles.errors}> {emailError} </Text>
        <TextInput style={styles.input}
          onChangeText={handleEmailChange}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
        />
        <TextInput style={styles.input}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          maxLength={40}
        />
        <Text style={styles.errors}> {passwordError} </Text>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={{fontFamily: "OpenSansBold", fontSize: 18}}> Login </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#181b20",
  },
  inputContainer: {
    width: "85%",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#A9A9A9",
    color: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
    height: 55,
    fontFamily: "OpenSansBold",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#FF954F",
    width: "100%",
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "OpenSansBold",
    fontSize: 20,
  },
  errors: {
    alignItems: "center",
    color: "red",
    paddingBottom: 5,
  },
  quitButton: {
    position: "absolute",
    zIndex: 1,
    top: -170,
    left: 0,
  },
  exitIcon: {
    width: 20,
    height: 20,
  }
})

export default UserForm
