import {Tabs} from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default () => {
  return (
  <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="topics"
        options={{
          title: "Home",
          tabBarIcon:({color}) => <FontAwesome size = {28} name = "home" color={color} />,
        }}
      />
      <Tabs.Screen name="info" options={{href: null}} />
      <Tabs.Screen
        name="llm"
        options={{
          title: "Ask",
          tabBarIcon: ({color}) => <FontAwesome size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({color}) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
  </Tabs>
  )
}
