import React, { useEffect, useRef, useState } from "react"
import {router, useLocalSearchParams} from "expo-router"
import {Animated, Text, SafeAreaView, View, ScrollView, StyleSheet, Pressable} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import { Entypo, FontAwesome } from '@expo/vector-icons'
import * as SecureStore from "expo-secure-store"
import {useFonts} from "expo-font"

const App = () => {
  const [extraInfo, setExtraInfo] = useState<string>('')
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false)
  const [segmentedTopicText, setSegmentedTopictext] = useState<string[]>([""])
  const [segmentedInfoText, setSegmentedInfoText] = useState<string[]>([""])
  const [showServerError, setShowServerError] = useState<boolean>(false)

  const infoBoxAnimation = useRef(new Animated.Value(0)).current

  useFonts({
    "OpenSansBold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "OpenSansRegular": require("../assets/fonts/OpenSans-Regular.ttf"),
  })

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
      const segmentedInfoText: string[]  = await response.data.extraInfo.split("\n\n")

      setSegmentedTopictext(segmentedTopicText)
      setSegmentedInfoText(segmentedInfoText)
      setShowServerError(false)
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
    const unchangedString = segmentedInfoText[index]
    const sentences = unchangedString.split(".")

    const formattedString = sentences.join(".\n\n")
    return formattedString
  }

  function openInfoBox(index: number) {
    Animated.timing(infoBoxAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
    setExtraInfo(mapExtraInfo(index, segmentedInfoText))
    setShowInfoBox(true)
  }

  function closeInfoBox() {
    Animated.timing(infoBoxAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
        setShowInfoBox(false)
        setExtraInfo("")
      })
  }

  const translateY = infoBoxAnimation.interpolate({
    inputRange: [0,1],
    outputRange: [500,0],
  })

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
              <View style={styles.readMoreContainer}>
                <FontAwesome name="info-circle" size={24} color="#FF954F" top={5} />
                <Text style={styles.readMoreText}>Click to read more...</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {showInfoBox && (
        <Animated.View style={[styles.infoBoxContainer, { transform: [{ translateY: translateY }] }]}>
          <ScrollView
            style={styles.infoBox}
            showsVerticalScrollIndicator={false}
          >
            {extraInfo && (
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}> {extraInfo} </Text>
              </View>
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={closeInfoBox}>
            <Entypo name="circle-with-cross" size={35} color="#FF954F" />
          </Pressable>
        </Animated.View>
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
    margin: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  textBox: {
    padding: 15,
    color: "white",
    backgroundColor: "#445565",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    fontFamily: "OpenSansBold",
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    paddingBottom: 15,
    backgroundColor: "#445565",
  },
  readMoreText: {
    marginLeft: 10,
    color: "#FF954F",
    fontFamily: "OpenSansBold",
    top: 5,
  },
  infoBoxContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  infoBox: {
    position: "absolute",
    top: "33%",
    left: "2.5%",
    right: "2.5%",
    bottom: 0,
    backgroundColor: "#181b20",
    padding: 20,
    paddingTop: 60,
    borderRadius: 10,
  },
  infoTextContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  infoText: {
    backgroundColor: "#445565",
    padding: 5,
    fontFamily: "OpenSansBold",
    fontSize: 18,
    color: "white",
  },
  closeButton: {
    position: "absolute",
    top: 250,
    right: 10,
    padding: 10,
  },
})
export default App
