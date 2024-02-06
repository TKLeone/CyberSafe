import {Stack} from "expo-router";

const RootLayout = () => {
  return <Stack>
     <Stack.Screen name = "index"
      options = {{
        headerShown: false,
      }}
    />
     <Stack.Screen name = "Login/login"
      options = {{
        headerShown: false,
      }}
    />
  </Stack>;
};

export default RootLayout;
