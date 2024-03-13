import React, { useEffect, useState } from "react"
import {router, useLocalSearchParams} from "expo-router"
import {Text, SafeAreaView, View, ScrollView, StyleSheet} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"

const fetchData = async (label: string | string[], ageRange: string | string[]) => {
  const sendData = JSON.stringify({
    label: label,
    ageRange: ageRange,
  })
  try {
    const response = await axios.post("http://192.168.1.100:8001/getTopicData", sendData,{headers: {"Content-Type": "application/json", withCredentials: true}})
    const data = response.data
    return data
  } catch(err) {
    const axiosError = err as AxiosError
    if (axiosError.response  && axiosError.response.status === 500) {
      // NOTE: add a popup or something
    }
  }
}

const App = () => {
  const [topicText, setTopicText] = useState<string>('')
  const [extraInfo, setExtraInfo] = useState<string>('')
  const params = useLocalSearchParams()
  const label = params.label ? params.label : ""
  const ageRange = params.ageRange ? params.ageRange : ""

  if (label === "" && ageRange === "") {
    router.navigate("/topics")
  }

  // TODO: TODAY add items to database based on gpt
  useEffect(() => {
    validateJWT(false)
    fetchData(label, ageRange).then((data)=>{
      if (data) {
        setTopicText(data.topic)
        setExtraInfo(data.extraInfo)
      }
    })
    return () => {
      setTopicText("")
      setExtraInfo("")
    }
  },[label, ageRange])

  const segmentedTopicText = topicText.split("\n\n")

  // TODO: TODAY add overlay that displays more information
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {segmentedTopicText.map((text, index) => (
            <View key={index} style={styles.textBoxContainer}>
              <Text style={styles.textBox}>
                {text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    top: 70,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBoxContainer: {
    width: "95%", // Adjust as needed
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  textBox: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})
export default App
