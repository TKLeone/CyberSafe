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
    <SafeAreaView>
      <View>
      <TextInput style={styles.root}
        onChangeText={handleEmailChange}
        placeholder="Email"
        value={email}
      />
      </View>
      <View>
        <TextInput style={styles.root}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          maxLength={40}
        />
        <Text style={styles.errors}> {passwordError} </Text>
      </View>
      <View style={styles.root}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text> Login </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20
  },
  button: {
    color: "white",
    backgroundColor: "red",
    width: "100%",
    borderColor:"white",
    marginVertical: 5,

  },
  errors: {
    alignItems: "center",
    color: "red",
  }
})

export default UserForm
