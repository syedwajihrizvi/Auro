import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'

const CustomInput = (
    {label, labelStyles, inputStyles, 
    containerStyles, secureTextEntry, children,
    handleChange, placeholder}) => {
  const [showChildren, setShowChildren] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <View className={`${containerStyles}`}>
        <Text className={`text-xl text-gray-200 mb-2 ${labelStyles}`}>{label}</Text>
        <View className={`bg-black-200 w-full h-[50px] rounded-lg relative ${isFocused ? 'border border-secondary': ''}`}>
            <TextInput className={`${inputStyles} text-white pl-5 flex-1`} 
                       secureTextEntry={secureTextEntry && !showChildren}
                       onChangeText={newText => handleChange(newText)}
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => setIsFocused(false)}
                       cursorColor='white'
                       placeholder={placeholder}
                       placeholderTextColor={'#CDCDE0'}/>
            <TouchableOpacity className='absolute right-5 top-5' onPress={() => {
                if (secureTextEntry) {
                  setShowChildren(!showChildren)
                }
              }}>
                {children}
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default CustomInput