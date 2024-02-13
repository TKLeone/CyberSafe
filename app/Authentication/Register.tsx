import axios, { AxiosError } from "axios"
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput} from "react-native"

// TODO: validate user forms
// valid email format
// sanitise forms
// TODO: do full authentication across app
const UserForm = () => {
  const[username, setUsername] = React.useState<string>('')
  const[password, setPassword] = React.useState<string>('')
  const[email, setEmail]= React.useState<string>('')
  const[usernameError, setUsernameError] = React.useState<string>('')
  const[passwordError, setPasswordError] = React.useState<string>('')
  const[emailError, setEmailError] = React.useState<string>('')

  const handleSubmit = async() => {
    if (!username) setUsernameError("Username is required")
    if (!password) setPasswordError("Password is required")
    if (!email) setEmailError("E-mail is required")

    try {
      let data = JSON.stringify ({
        username: username,
        password: password,
        email: email,
      })
      const response = await axios.post("http://192.168.1.100:8001/users/", data, {headers: {"Content-Type": "application/json"}})
      console.log(response.data)
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 400) {
        setEmailError("Email already exists. Please choose another one or log in.")
      }
      console.log("Error", err)
    }
  }
  
  const handleEmailChange = (value: string) => {
    setEmailError('')
    setEmail(value)
  }
  
  const handleUsernameChange = (value: string) => {
    setUsernameError('')
    setUsername(value)
  }

  const handlePasswordChange = (value: string) => {
    setPasswordError('')
    setPassword(value)
  }

  return(
  <SafeAreaView>
      <View>
      <View>
        <TextInput
          onChangeText={handleUsernameChange}
          placeholder="Username"
          value={username}
          maxLength={15}
        />
        <Text style={styles.errors}> {usernameError} </Text>
      </View>
      <View>
        <TextInput
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          maxLength={15}
        />
        <Text style={styles.errors}> {passwordError} </Text>
      </View>
      <View>
        <TextInput
          onChangeText={handleEmailChange}
          placeholder="email"
          value={email}
          keyboardType="email-address"
        />
        <Text style={styles.errors}> {emailError} </Text>
      </View>
      </View>
      <View style={styles.root}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text> Register </Text>
        </Pressable>
      </View>
  </SafeAreaView>
  )
}

// TODO: styling for log in page
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
