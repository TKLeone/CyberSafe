import axios, { AxiosError } from "axios"
import { Entypo } from '@expo/vector-icons'
import React from "react"
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput, Image} from "react-native"
import { Dropdown} from "react-native-element-dropdown"
import {router} from "expo-router"
import validator from "validator"
import * as SecureStore from "expo-secure-store"

const UserForm = () => {
  const[password, setPassword] = React.useState<string>('')
  const[email, setEmail]= React.useState<string>('')
  const[ageRange, setAgeRange] = React.useState<string>('')
  const[passwordError, setPasswordError] = React.useState<string>('')
  const[emailError, setEmailError] = React.useState<string>('')
  const[ageRangeError, setAgeRangeError] = React.useState<string>('')

  const handleSubmit = async() => {
    let hasErrors: boolean = false;

    if (!password) {
      setPasswordError("Password is required") 
      hasErrors = true
    }
    if (!email) {
      setEmailError("E-mail is required")
      hasErrors = true
    }
    if (!ageRange) {
      setAgeRangeError("Fill out your age range")
      hasErrors = true
    }
    if (!validateEmail(email)) {
      setEmailError("E-mail is not in a valid format")
      hasErrors = true
    }

    if (hasErrors) {
      return;
    }

    try {
      let data = JSON.stringify ({
        password: password,
        email: email,
        ageRange: ageRange,
      })

      const response = await axios.post("http://192.168.1.100:8001/users", data, {headers: {"Content-Type": "application/json"}})
      if (response.status === 200) {
        router.navigate("Authentication/Login")
      }
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 400) {
        setEmailError("Email already exists. Please choose another one or log in.")
      }
    }
  }

  interface IAgeRange {
    label: string,
    value: string,
  }
  const ageRangeData: IAgeRange[] = [
    {label: "13-14", value: "13-14"},
    {label: "15-16", value: "15-16"},
    {label: "17-19", value: "17-19"},
  ]

  const handleEmailChange = (value: string) => {
    setEmailError('')
    setEmail(value)
  }

  const handlePasswordChange = (value: string) => {
    setPasswordError('')
    setPassword(value)
  }

  const validateEmail = (email: string): boolean => {
    return validator.isEmail(email)
  }

  // TODO: styling for age range
  return(
  <SafeAreaView style={styles.root}>
      <View style={styles.inputContainer}>
        <Pressable style={styles.quitButton} onPress={() => router.navigate("/")}>
            <Entypo name="circle-with-cross" size={35} color="#FF954F" />
        </Pressable>
        <Text style={styles.errors}> {emailError} </Text>
        <TextInput
          style={styles.input}
          onChangeText={handleEmailChange}
          placeholder="email"
          value={email}
          keyboardType="email-address"
        />
        <Text style={styles.errors}> {passwordError} </Text>
        <TextInput
          style={styles.input}
          onChangeText={handlePasswordChange}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          maxLength={15}
        />
        <Text style={styles.errors}> {ageRangeError} </Text>
        <Dropdown
          data = {ageRangeData}
          labelField="label"
          valueField="value"
          value={ageRange}
          placeholder="Age Range"
          onChange={item => {
            setAgeRange(item.value)
          }}
        />
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text> Register </Text>
        </Pressable>
      </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#181b20",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    marginBottom: 10,
    height: 55
  },
  button: {
    backgroundColor: "#FF954F",
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
