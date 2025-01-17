import {router} from "expo-router"
import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, Pressable, StyleSheet, View, ScrollView } from "react-native"
import validateJWT from "../Authentication/validateJWT"
import axios, { AxiosError } from "axios"
import { FontAwesome } from "@expo/vector-icons"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"

interface buttonData {
  importance: number,
  label: string,
}

interface userData {
  ageRange: string,
}

const buttons: buttonData[] = [
  {importance: 1, label: "PHISHING"},
  {importance: 2, label: "ONLINE GAMING"},
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
    "13-14":[3,6,1,5,4,2,7,8,9,10],
    "15-16":[3,6,2,1,5,4,7,8,9,10],
    "17-19":[9,5,10,1,2,6,7,8,3,4],
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

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/ageRange", {token},{withCredentials: true})
      const {ageRange} = response.data as userData
      setShowServerError(false)
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

  const handleClick = (label: string) => {
    router.push({pathname: "/info", params: {label}})
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
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {sortedButtons.map((button) => (
          <Pressable key={button.importance} onPress={() => handleClick(button.label)} style={styles.button}>
            <Text style={styles.labelText}>{button.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
    alignItems: "center",
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
