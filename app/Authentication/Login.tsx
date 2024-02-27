import axios, { AxiosError } from "axios"
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput} from "react-native"
import {router} from "expo-router"

// TODO: finish form validation
const UserForm = () => {
  const[email, setEmail] = React.useState<string>('')
  const[password, setPassword] = React.useState<string>('')
  const[EmailError, setEmailError] = React.useState<string>('')
  const[passwordError, setPasswordError] = React.useState<string>('')

  const handleLogin = async () => {
    let data = JSON.stringify({
      email: email,
      password: password,
    })
    // TODO: send form data to server
    try {
      const response = await axios.post("http://192.168.1.100:8001/login/", data, {headers: {"Content-Type": "application/json"}})
      // TODO: do navigation for the successful login
      // TODO: navigate to actual page
      if (response.status === 200) {
        console.log(response)
        router.replace("UserPages/Home")
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

  return (
    <SafeAreaView style={styles.root}>
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
  }
})

export default UserForm
