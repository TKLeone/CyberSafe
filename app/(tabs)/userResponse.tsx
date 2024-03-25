import React, { useCallback, useState } from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import * as SecureStore from "expo-secure-store"
import { useFonts} from "expo-font"
import { FontAwesome } from "@expo/vector-icons"
import {useFocusEffect} from "expo-router"

const App = () => {
  const [segmentedResponseData, setSegmentedResponseData] = useState<string[]>([""])
  const [showServerError, setShowServerError] = useState<boolean>(false)

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync("jwt")
    try {
      const response = await axios.post("http://192.168.1.100:8001/getResponse", {token})
      if(response.data === "empty") {
        return setSegmentedResponseData([""])
      }
      const segmentedResponseData: string[] = response.data.info.split("\n\n\n")
      setShowServerError(false)
      setSegmentedResponseData(segmentedResponseData)

    } catch (err) {
      const axiosError = err as AxiosError
      if(axiosError.response && axiosError.response.status === 500) {
        setShowServerError(true)
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      validateJWT(false)
      fetchData()
      return () => {
      }
    },[])
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> GPT Responses</Text>
      </View>
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
      {showServerError && (
        <View style={styles.serverError}>
          <FontAwesome style={styles.serverVector} name="server" size={24} color="black" />
          <Text> An error has occured </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181b20",
    fontSize: 30,
  },
  header: {
  },
  headerText: {
    color: "#FF954F",
    margin: 10,
    fontFamily: "OpenSansBold",
    fontSize: 30,
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
