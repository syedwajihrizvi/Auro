import { View, Image, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'
import React from 'react'

const TabIcon = ({icon, name, color, focused}) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        <Image source={icon} resizeMode='contain' tintColor={color} className='w-6 h-6'/>
        <Text className={`${focused ? 'font-psemibold':'font-pregular'} text-xs w-full mt-1`} 
              style={{color: color}} numberOfLines={1}>{name}</Text>
    </View>
)

const TabsLayout = () => {
  return (
        <Tabs
            screenOptions={{tabBarShowLabel: false, 
                            tabBarStyle: { minHeight: 'auto',  position: 'absolute', backgroundColor: '#161622'},
                            tabBarActiveTintColor: '#FFA001',
                            tabBarInactiveTintColor: '#CDCDE0',
                            headerShown: false}}
            >
            <Tabs.Screen 
                name="home"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen 
                name="create"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => <TabIcon icon={icons.plus} name="Create" color={color} focused={focused}/>
            }}/>
            <Tabs.Screen 
                name="profile"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, focused}) => <TabIcon icon={icons.profile} name="Profile" color={color} focused={focused}/>
            }}/>
        </Tabs>
  )
}

export default TabsLayout