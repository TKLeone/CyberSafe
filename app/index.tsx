import {Text, SafeAreaView } from "react-native";
import {Link} from "expo-router";

const HomePage = () => {
    return (
      <SafeAreaView>
        <Text> Home Page</Text>
        <Link href="/Authentication/Register"> Go to register page</Link>
      </SafeAreaView>
    )
}

export default HomePage;
