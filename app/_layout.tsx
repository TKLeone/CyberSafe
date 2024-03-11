import {Stack} from "expo-router";

const RootLayout = () => {
  return <Stack>
    <Stack.Screen name = "index"
      options = {{
        headerShown: false,
      }}
    />
    <Stack.Screen name = "UserPages/topics"
      options = {{
        headerShown: false,
      }}
    />
    <Stack.Screen name = "UserPages/info"
      options = {{
        headerShown: false,
      }}
    />
    <Stack.Screen name = "Authentication/Register"
      options = {{
        headerShown: false,
      }}
    />
    <Stack.Screen name = "Authentication/Login"
      options = {{
        headerShown: false,
      }}
    />
  </Stack>;
};

export default RootLayout;
