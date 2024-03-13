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
    const topicText = response.data
    return topicText
  } catch(err) {
    const axiosError = err as AxiosError
    if (axiosError.response  && axiosError.response.status === 500) {
      console.log("this doesn't work")
    }
  }
}
// NOTE: maybe do something with this
const navigateBackToHome = () => {
  router.navigate("/topics")
}

const App = () => {
  const [topicText, setTopicText] = useState<string>('')
  const params = useLocalSearchParams()
  const label = params.label ? params.label : ""
  const ageRange = params.ageRange ? params.ageRange : ""

  // TODO: TODAY add items to database based on gpt
  useEffect(() => {
    validateJWT(false)
    fetchData(label, ageRange).then((data)=>{
      if (data) {
        setTopicText(data)
      }
    })
    return () => {
      setTopicText("")
    }
  },[label, ageRange])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textBox}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text>
            {topicText}
        </Text>
      </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scrollView: {
    flexGrow: 1,
  },
  textBox: {
    height: "60%",
    width: "95%",
    top: -120,
    paddingTop: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})
export default App
