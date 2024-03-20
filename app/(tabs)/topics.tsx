import {router, Link} from "expo-router"
import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, Pressable, StyleSheet, View } from "react-native"
import validateJWT from "../Authentication/validateJWT"
import axios, { AxiosError } from "axios"
import { FontAwesome } from '@expo/vector-icons'
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"

interface buttonData {
  importance: number,
  label: string,
}

interface userData {
  ageRange: string,
}

// TODO: add more topics and info
const buttons: buttonData[] = [
  {importance: 1, label: "PHISHING"},
  {importance: 2, label: "REPLACE VALUE"},
  {importance: 3, label: "CYBER BULLYING"},
  {importance: 4, label: "ONLINE PREDATORS"},
  {importance: 5, label: "PEER PRESSURE"},
  {importance: 6, label: "MALWARE"},
  {importance: 7, label: "PRIVACY SETTINGS"},
  {importance: 8, label: "ONLINE CONTENT"},
  {importance: 9, label: "ONLINE DATING"},
  {importance: 10, label: "IDENTIFYING SCAMS"},
]

const updateButtonImportance =  (buttons: buttonData[], ageRangeData: string) => {
  const ageRange = ageRangeData

  const importanceMap: Record<string, number[]> = {
    // TODO: change topic importance to correct age ranges
    "13-14":[4,5,3,1,2,6,7,8,9,10],
    "15-16":[1,10,5,4,3,6,7,8,9,2],
    "17-19":[7,2,3,10,5,6,1,8,9,4],
  }

  const customImportance = importanceMap[ageRange]

  return buttons.map((button, index) => ({
    ...button,
    importance: customImportance[index]
  }))
}

const App = () => {
  const [ageRange, setAgeRange] = useState<string>("")
  const [showServerError, setShowServerError] = useState<boolean>(false)
  const [isSingleColumn, setIsSingleColumn] = useState<boolean>(false)

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

  const toggleButtonLayout = () => {
    setIsSingleColumn((prevState) => !prevState)
  }

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/ageRange", {token},{withCredentials: true})
      const {ageRange} = response.data as userData
      setShowServerError(false)
      console.log("server error")
      return {ageRange}
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response && axiosError.response.status === 500) {
        setShowServerError(true)
      }
    }
  }

  useEffect(() => {
    validateJWT(false)
    console.log("why isn't this triggering")
    fetchData().then((data) => {
      if (data) {
        setAgeRange(data.ageRange)
      }
    })
    return () => {
      setShowServerError(false)
    }
  },[])

  const updatedButtons = ageRange ? updateButtonImportance(buttons, ageRange) : buttons

  const sortedButtons = updatedButtons.slice().sort((a,b) => a.importance - b.importance)

  const handleClick = (label: string, ageRange: string) => {
    router.push({pathname: "/info", params: {label, ageRange}})
  }

  return (
    <SafeAreaView style={styles.container}>
      {showServerError && (
        <View style={styles.serverError}>
          <FontAwesome name="server" size={24} color="black" />
          <Text> An error has occured </Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.headerText}> Security Topics </Text>
      </View>
      <View style={styles.buttonContainer}>
        {sortedButtons.map((button) => (
          <Pressable key={button.importance} onPress={() => handleClick(button.label, ageRange)} style={styles.button}>
            <Text style={styles.labelText}>{button.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b20",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  serverError: {
    alignSelf: "center"
  },
  header: {
    alignSelf: "center",
  },
  headerText: {
    color: "#FF954F",
    margin: 10,
    fontFamily: "OpenSansBold",
    fontSize: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 10, 
  },
  button: {
    width: 182,
    height: 110,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#445565",
    padding: 10,
    margin: 5,
    borderRadius: 25,
  },
  labelText: {
    color: "white",
    margin: 10,
    fontFamily: "OpenSansBold",
    fontSize: 22,
  }
})

export default App
