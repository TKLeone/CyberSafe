import {router, Link} from "expo-router"
import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, Pressable, StyleSheet, View } from "react-native"
import validateJWT from "../Authentication/validateJWT"
import axios, { AxiosError } from "axios"


interface buttonData {
  importance: number,
  label: string,
}

interface userData {
  ageRange: string,
}

const fetchData = async () => {
  try {
    const response = await axios.get("http://192.168.1.100:8001/ageRange", {withCredentials: true})
    const {ageRange} = response.data as userData
    return {ageRange}
  } catch (err) {
    const axiosError = err as AxiosError
    if (axiosError.response && axiosError.response.status === 500) {
      // NOTE: add a popup or something
    }
  }
}


const buttons: buttonData[] = [
  {importance: 1, label: "Phishing"},
  {importance: 2, label: "Cyber-bullying"},
  {importance: 4, label: "Online Predators"},
  {importance: 5, label: "Peer Pressure"},
  {importance: 6, label: "Malware"},
  {importance: 7, label: "Privacy Settings"},
  {importance: 8, label: "Online Content"},
  {importance: 9, label: "Online Dating"},
  {importance: 10, label: "Identifying scams"},
]

const updateButtonImportance =  (buttons: buttonData[], ageRangeData: string) => {
  const ageRange = ageRangeData

  const importanceMap: Record<string, number[]> = {
    // NOTE: change topic importance to correct age ranges
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
  useEffect(() => {
    validateJWT(false)
    fetchData().then((data) => {
      if (data) {
      setAgeRange(data.ageRange)
      }
    })
  },[])

  const updatedButtons = ageRange ? updateButtonImportance(buttons, ageRange) : buttons

  const sortedButtons = updatedButtons.slice().sort((a,b) => a.importance - b.importance)

  const handleClick = (label: string, ageRange: string) => {
    router.push({pathname: "/info", params: {label, ageRange}})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
      {sortedButtons.map((button, index) => (
        <Pressable key={index} onPress={() => handleClick(button.label, ageRange)} style={styles.button}>
            <Text>{button.label}</Text>
        </Pressable>
      ))}
      </View>
    </SafeAreaView>
  )
}


// TODO: change to one button per row
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 10, 
  },
  button: {
    width: 175,
    height: 50,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
})

export default App