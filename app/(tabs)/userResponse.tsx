import React, { useEffect, useState } from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"
const App = () => {
  const [segmentedResponseData, setSegmentedResponseData] = useState<string[]>([""])

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

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

  // TODO: figure out a way to auto update once response is created
  useEffect(() => {
    validateJWT(false)
    fetchData()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        {segmentedResponseData.length > 0 && segmentedResponseData[0] !== "" ? (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {segmentedResponseData.map((data, index) => (
              <Text style={[styles.responseContainer, {fontFamily: "OpenSansBold", fontSize: 15}]} key={index}> {data}</Text>
            ))}
          </ScrollView>
        ) : (
            <Text style={styles.noData}> No data Available </Text>
          )}
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b20",
    fontSize: 30,
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
  responseContainer: {
    borderWidth: 1,
    borderColor: "#FF954F",
    width: "95%",
    color: "white",
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#445565",
    overflow: "hidden",
    borderRadius: 10,
    padding: 10,
  },
  noData: {
    position: "absolute",
    fontFamily: "OpenSansBold",
    fontSize: 30,
    color: "#FF954F",
    alignSelf: "center",
    top: 300,
  },
})

export default App
