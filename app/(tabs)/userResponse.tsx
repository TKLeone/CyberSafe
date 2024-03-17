import React, { useEffect } from "react"
import {Text, SafeAreaView, View} from "react-native"
import axios from "axios"
import validateJWT from "../Authentication/validateJWT"

// TODO: get api responses from db
const App = () => {
  useEffect(() => {
    validateJWT(false)
  },[])

}

export default App
