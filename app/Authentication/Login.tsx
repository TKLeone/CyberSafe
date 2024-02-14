import axios from "axios"
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput} from "react-native"

// TODO: finish form validation
// TODO: send form data to server
// TODO: navigate to actual page
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
    try {
      const response = await axios.post("http://192.168.1.100:8001/login/", data, {headers: {"Content-Type": "application/json"}})
      const token = response.data.token
    } catch (err) {

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
      <TextInput style={styles.form}
        onChangeText={handleEmailChange}
        placeholder="Email"
        value={email}
      />
      </View>
      <View>
        <TextInput style={styles.form}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          maxLength={40}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  form: {

  }
})
