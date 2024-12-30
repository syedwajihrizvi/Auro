import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isLoading}) => {
  return (
    <TouchableOpacity 
        className={`bg-secondary rounded-xl min-h-[62px] 
                    justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50':''}`}
        delayPressOut={isLoading}
        onPress={handlePress}>
        <Text className={`text-white text-2xl font-pmedium ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton