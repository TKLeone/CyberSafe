import {Text, SafeAreaView } from "react-native";
import {Link, router} from "expo-router";

const HomePage = () => {

  const goToLogin = () =>{
    router.navigate("/Authentication/Login")
  }

  return (
    <SafeAreaView>
      <Text> Home Page</Text>
      <Link href="/Authentication/Register"> Go to register page</Link>
      <Text onPress={goToLogin}> Go to login page</Text>
    </SafeAreaView>
  )
}

export default HomePage;
