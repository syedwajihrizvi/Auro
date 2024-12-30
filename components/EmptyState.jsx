import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title, subtitle}) => {
  return (
    <View className='items-center justify-center px-4'>
      <Image source={images.empty} resizeMode='contain' className='w-[270px] h-[240px]'/>
      <Text className='text-white font-pextrabold text-lg'>{title}</Text>
      <Text className='text-white text-center font-pmedium text-sm'>{subtitle}</Text>
      <CustomButton title="Create video" 
                    handlePress={() => router.push('/create')}
                    containerStyles='my-3 w-full'/>
    </View>
  )
}

export default EmptyState