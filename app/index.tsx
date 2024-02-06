import {Text, SafeAreaView } from "react-native";
import {Link} from "expo-router";

const HomePage = () => {
    return (
      <SafeAreaView className="bg-red-50">
        <Text> Home Page</Text>
        <Link href="/Login/login"> Go to login page</Link>
      </SafeAreaView>
    )
}

export default HomePage;
