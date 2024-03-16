import React, { useEffect, useState } from "react"
import {router, useLocalSearchParams} from "expo-router"
import {Text, SafeAreaView, View, ScrollView, StyleSheet, Pressable} from "react-native"
import axios, { AxiosError } from "axios"
import validateJWT from "../Authentication/validateJWT"
import { Entypo } from '@expo/vector-icons'

const App = () => {
  const [extraInfo, setExtraInfo] = useState<string>('')
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false)
  const [segmentedTopicText, setSegmentedTopictext] = useState<string[]>([""])
  const [segmentedInfoText, setSegmentedInfoText] = useState<string[]>([""])

  const fetchData = async (label: string | string[], ageRange: string | string[]) => {
    const sendData = JSON.stringify({
      label: label,
      ageRange: ageRange,
    })
    try {
      const response = await axios.post("http://192.168.1.100:8001/getTopicData", sendData,{headers: {"Content-Type": "application/json", withCredentials: true}})

      const segmentedTopicText: string[] = await response.data.topic.split("\n\n")
      const segmentedInfoText: string[]  = await response.data.extraInfo.split("\n\n")

      setSegmentedTopictext(segmentedTopicText)
      setSegmentedInfoText(segmentedInfoText)

    } catch(err) {
      const axiosError = err as AxiosError
      if (axiosError.response  && axiosError.response.status === 500) {
        // NOTE: add a popup or something
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
  console.log(segmentedTopicText[0])

  // TODO: TODAY add items to database based on gpt
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
    width: "95%",
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
  infoBoxContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    position: 'absolute',
    top: '33%',
    left: "2.5%",
    right: "2.5%",
    bottom: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderRadius: 10,
  },
  infoText: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 250,
    left: 10,
    padding: 10,
  },
})
export default App
