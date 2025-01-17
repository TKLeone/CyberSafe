import React from "react"
import {Tabs} from "expo-router"
import FontAwesome from "@expo/vector-icons/FontAwesome"

const navBar = () => {
  return (
  <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {backgroundColor: "#536878"},
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: "#FF954F",
      }}
    >
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
        name="userResponse"
        options={{
          title: "Responses",
          tabBarIcon: ({color}) => <FontAwesome name="sticky-note-o" size={24} color={color} />
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

export default navBar
