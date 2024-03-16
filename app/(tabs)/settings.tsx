import React from "react"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"

// TODO: add logout screen, think of more setttings
// TODO: add delete account option
// NOTE: potentially add changing age range
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.logOutText}>Log out your account... </Text>
        <Pressable style={styles.logOutButton}>
          <Text> Log out </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logOutText:  {

  },
  logOutContainer: {
    position:"relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logOutButton: {
    width: "80%",
    padding: 10,
    color: "red",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  }
})
export default App
