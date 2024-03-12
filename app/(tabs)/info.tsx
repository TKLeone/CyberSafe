import React from "react"
import {Text, SafeAreaView, View, ScrollView, StyleSheet} from "react-native"

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textBox}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text>
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
    width: "90%",
    top: -120,
    paddingTop: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})
export default App
