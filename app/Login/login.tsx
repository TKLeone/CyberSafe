import axios from "axios";
import React from "react";
import {Pressable, View, SafeAreaView,StyleSheet,Text,TextInput} from "react-native";

const UserForm = () => {
  const[username, setUsername] = React.useState<string>('');
  const[password, setPassword] = React.useState<string>('');
  const[email, setEmail]= React.useState<string>('');

  const handleSubmit = async() => {
    try {
      let data = JSON.stringify ({
        username: username,
        password: password,
        email: email,
      })
      const response = await axios.post("http://127.0.0.1:8001/users/", data, {headers: {"Content-Type": "application/json"}})
      console.log(response.data)
    } catch (err) {
      console.log("Error", err)
    }
  }

  return(
  <SafeAreaView>
      <View>
      <View>
      <TextInput
        onChangeText={setUsername}
        placeholder="Username"
        value={username}
        maxLength={15}
      />
      </View>
      <View>
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        maxLength={15}
      />
      </View>
      <View>
      <TextInput
        onChangeText={setEmail}
        placeholder="email"
        value={email}
      />
      </View>
      </View>
      <View style={styles.root}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text> Log-in </Text>
        </Pressable>
      </View>
  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20
  },
  button: {
    color: "white",
    backgroundColor: "red",
    width: "100%",
    borderColor:"white",
    marginVertical: 5,

  }
})

export default UserForm;
