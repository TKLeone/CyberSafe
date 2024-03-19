import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import * as SecureStore from "expo-secure-store"

const App = () => {
  const [segmentedResponseData, setSegmentedResponseData] = useState<string[]>([""])

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/getResponse", {token})
      const segmentedResponseData: string[] = response.data.info.split("\n\n\n")

      setSegmentedResponseData(segmentedResponseData)

    } catch (err) {
      const axiosError = err as AxiosError
      if(axiosError.response && axiosError.response.status === 500) {
      }
    }
  }
  useEffect(() => {
    validateJWT(false)
    fetchData()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
        {segmentedResponseData.map((data, index) => (
          <Text key={index}> {data}</Text>
        ))}
        </ScrollView>
        </View>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  scrollView: {

  },
  scrollViewContent: {

  }
})

export default App
