import axios, { AxiosError } from "axios"
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput, Image} from "react-native"
import {router} from "expo-router"

// TODO: finish form validation
const UserForm = () => {
  const[email, setEmail] = React.useState<string>('')
  const[password, setPassword] = React.useState<string>('')
  // TODO: do input validation
  const[emailError, setEmailError] = React.useState<string>('')
  const[passwordError, setPasswordError] = React.useState<string>('')

  const handleLogin = async () => {
    let data = JSON.stringify({
      email: email,
      password: password,
    })
    try {
      const response = await axios.post("http://192.168.1.100:8001/login", data, {headers: {"Content-Type": "application/json"}, withCredentials: true})
      if (response.status === 200) {
        router.replace("UserPages/topics")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 401) {
        setPasswordError("Password or email is wrong")
      }
    }
  }

  const handleEmailChange = (value: string) => {
    setEmailError('')
    setEmail(value)
  }

  const handlePasswordChange = (value: string) => {
    setPasswordError('')
    setPassword(value)
  }
  // TODO: add a "x" button that takes you back to the home screen
  return (
    <SafeAreaView style={styles.root}>
      <Pressable style={styles.quitButton} onPress={() => router.navigate("/")}>
        <Image source={require("../../assets/exit.png")} style={styles.exitIcon}/>
        </Pressable>
      <View style={styles.inputContainer}>
      <TextInput style={styles.input}
        onChangeText={handleEmailChange}
        placeholder="Email"
        value={email}
      />
        <TextInput style={styles.input}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          maxLength={40}
        />
        <Text style={styles.errors}> {passwordError} </Text>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text> Login </Text>
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
    padding: 20
  },
  inputContainer: {
    position: "relative",
    width: "85%",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#ffffff",
    color: "black",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    height: 55
  },
  button: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18
  },
  errors: {
    alignItems: "center",
    color: "red",
    paddingBottom: 5,
  },
  quitButton: {
    position: "absolute",
    top: 80,
    left: 25,
    zIndex: 999,
    padding: 5,
    borderRadius: 5,
  },
  exitIcon: {
    width: 17,
    height: 17,
  }
})

export default UserForm
