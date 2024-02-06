import React from "react";
import {Pressable, SafeAreaView,StyleSheet,Text,TextInput} from "react-native";

function handleAuth() {
console.log("this works fine unlike dogshit input boxes that i could've done in regular html")
}
const UserForm = () => {
  const[username, setUsername] = React.useState<string>('this suck');
  const[password, setPassword] = React.useState<string>('Random');
  const[email, setEmail]= React.useState<string>('Random');

  return(
  <SafeAreaView>
      <div className="content-center">
      <div>
      <TextInput
        onChangeText={setUsername}
        placeholder="Username"
        value={username}
        maxLength={15}
      />
      </div>
      <div>
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        maxLength={15}
      />
      </div>
      <div>
      <TextInput
        onChangeText={setEmail}
        placeholder="email"
        value={email}
      />
      </div>
      </div>
      <div style={styles.root}>
        <Pressable style={styles.button}>
          <Text> Log-in </Text>
        </Pressable>
      </div>
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
