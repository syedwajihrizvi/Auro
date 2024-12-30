import { View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router, usePathname } from 'expo-router'
import { icons } from '../constants'


const SearchInput = ({placeholder}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')
  
  const pathName = usePathname()
  const handleSearchPress = () => {
    if (pathName.startsWith('/search')) {
      router.setParams({query: value})
      console.log("Called if")
    }
    else router.push(`/search/${value}`)
  }

  return (
    <View className='mt-6'>
        <View className={`bg-black-200 w-full h-[50px] rounded-lg relative ${isFocused ? 'border border-secondary': ''}`}>
            <TextInput className='text-white pl-5 flex-1'
                       onFocus={() => setIsFocused(true)}
                       onBlur={() => setIsFocused(false)}
                       onChangeText={(text) => setValue(text)}
                       cursorColor='white'
                       placeholder={placeholder}
                       placeholderTextColor={'#CDCDE0'}/>
            <TouchableOpacity className='absolute right-5 top-5' onPress={handleSearchPress}>
                <Image source={icons.search} className='size-6'/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SearchInput