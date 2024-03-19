import React, { useEffect, useState } from "react"
import {router, useLocalSearchParams} from "expo-router"
import {Text, SafeAreaView, View, ScrollView, StyleSheet, Pressable} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import { Entypo, FontAwesome } from '@expo/vector-icons'
import * as SecureStore from "expo-secure-store"

const App = () => {
  const [extraInfo, setExtraInfo] = useState<string>('')
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false)
  const [segmentedTopicText, setSegmentedTopictext] = useState<string[]>([""])
  const [segmentedInfoText, setSegmentedInfoText] = useState<string[]>([""])
  const [showServerError, setShowServerError] = useState<boolean>(false)

  const fetchData = async (label: string | string[], ageRange: string | string[]) => {
    const token = await SecureStore.getItemAsync("jwt")
    const sendData = JSON.stringify({
      label: label,
      ageRange: ageRange,
      token
    })
    try {
      const response = await axios.post("http://192.168.1.100:8001/getTopicData", sendData,{headers: {"Content-Type": "application/json", withCredentials: true}})

      const segmentedTopicText: string[] = await response.data.topic.split("\n\n")
      // NOTE: investigate async await and why this breaks some things if data isn't there
      const segmentedInfoText: string[]  = await response.data.extraInfo.split("\n\n")

      setSegmentedTopictext(segmentedTopicText)
      setSegmentedInfoText(segmentedInfoText)

    } catch(err) {
      const axiosError = err as AxiosError
      if (axiosError.response  && axiosError.response.status === 500) {
        setShowServerError(true)
      }
    }
  }

  const params   = useLocalSearchParams()
  const label    = params.label ? params.label : ""
  const ageRange = params.ageRange ? params.ageRange : ""

  useEffect(() => {
    validateJWT(false)
    fetchData(label, ageRange)
    if (label === "" && ageRange === "") {
      router.navigate("/topics")
    }
    return () => {
      setExtraInfo("")
      setSegmentedInfoText([])
      setSegmentedTopictext([])
      closeInfoBox()
    }
  },[label, ageRange])

  const mapExtraInfo = (index: number, segmentedInfoText: string[]): string => {
    const result = segmentedInfoText[index]
    return result
  }

  function openInfoBox(index: number) {
    setExtraInfo(mapExtraInfo(index, segmentedInfoText))
    setShowInfoBox(true)
  }

  function closeInfoBox() {
    setShowInfoBox(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {segmentedTopicText.map((text, index) => (
            <Pressable
              key={index}
              style={styles.textBoxContainer}
              onPress={() => openInfoBox(index)}
            >
              <Text style={styles.textBox}>
                {text}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {showInfoBox && (
        <View style={styles.infoBoxContainer}>
          <ScrollView
            style={styles.infoBox}
            showsVerticalScrollIndicator={false}
          >
            {extraInfo && (
              <Text style={styles.infoText}> {extraInfo} </Text>
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={closeInfoBox}>
            <Entypo name="circle-with-cross" size={35} color="black" />
          </Pressable>
        </View>
      )}
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
    top: 70,
    flex: 1,
    backgroundColor: "#212121",
    justifyContent: "center",
    alignItems: "center"
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
  textBoxContainer: {
    width: "95%",
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  textBox: {
    padding: 15,
    color: "white",
    backgroundColor: "#D22B2B",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  infoBoxContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    position: "absolute",
    top: "33%",
    left: "2.5%",
    right: "2.5%",
    bottom: 0,
    backgroundColor: "#A9A9A9",
    padding: 20,
    paddingTop: 60,
    borderRadius: 10,
  },
  infoText: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#A9A9A9",
    borderRadius: 10,
    padding: 5,
  },
  closeButton: {
    position: "absolute",
    top: 250,
    left: 10,
    padding: 10,
  },
})
export default App
