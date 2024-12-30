import { View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../../components/CustomInput'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { useVideoPlayer, VideoView } from 'expo-video'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState(
    {
      title: '',
      video: null,
      thumbnail: null,
      prompt: null
    }
  )

  console.log(user)
  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType == 'thumbnail' ? ['images'] : ['videos'],
    })
    if (!result.canceled) {
      if (selectType == 'thumbnail') {
        setForm({...form, thumbnail: result.assets[0]})
      } else {
        setForm({...form, video: result.assets[0]})
      }
    } else {
      setTimeout(() => {
        Alert.alert('Document picked', JSON.stringify(result, null, 2))
      }, 100)
    }
  }

  const player = useVideoPlayer(form.video ? {uri: form.video.uri} : null, player => {
    player.loop = true;
    player.play()
  })

  const handleSubmit = async () => {
    console.log(user)
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      return Alert.alert('Invalid Form', "Please fill out all information")
    }
    setUploading(true)
    try {
      await createVideo({...form, user })
      Alert.alert('Success', 'Post uploaded successfully')
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: null
      })
      setUploading(false)
    }
  }

  const handleTitleChange = (value) => {
    setForm((prev) => ({...prev, title: value}))
  }

  const handlePromptChange = (value) => {
    setForm((prev) => ({...prev, prompt: value}))
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>Upload Video</Text>
        <CustomInput containerStyles='mt-10 mb-8' 
                     placeholder='Give your video a catchy title...' 
                     label='Video Title'
                     handleChange={handleTitleChange}/>
        <View className='mt-6 gap-6'>
          <Text className='text-xl text-gray-200 mb-2'>Upload Video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? 
            <View>
              <TouchableOpacity onPress={() => setForm({...form, video: null})}>
                <Image source={icons.garbage} className='size-8 p-2 bg-secondary-100 rounded-full'/>
              </TouchableOpacity>
              <VideoView
              style={{ width: '100%', height: 200, borderRadius: 2 }} player={player}/>
            </View>: 
            <View className='w-full h-[200px] items-center justify-center bg-black-100 rounded-lg'>
                <View className='border-dashed border border-secondary-100 p-4'>
                  <Image source={icons.upload} className='size-10'/>
                </View>
            </View>}
          </TouchableOpacity>
        </View>

        <View className='mt-7 gap-6'>
          <Text className='text-xl text-gray-200 mb-2'>Thumbnail Image</Text>
          <TouchableOpacity onPress={() => openPicker('thumbnail')}>
            {form.thumbnail ? 
            <View className='gap-5'>
              <TouchableOpacity onPress={() => setForm({...form, thumbnail: null})}>
                <Image source={icons.garbage} className='size-8 p-2 bg-secondary-100 rounded-full'/>
              </TouchableOpacity>
              <Image source={{uri: form.thumbnail.uri}} className='w-full h-40 rounded-md'/>
            </View> : 
            <View className='w-full h-20 items-center justify-center bg-black-100 rounded-lg'>
                <View className='p-2 flex-row items-center gap-4 justify-center'>
                  <Image source={icons.upload} className='size-8'/>
                  <Text className='text-gray-100 mt-1 text-lg font-pregular'>Choose a file</Text>
                </View>
            </View>}
          </TouchableOpacity>
        </View>

        <CustomInput containerStyles='mt-10 mb-8' 
                     placeholder='AI Prompt of your video...' 
                     label='AI Prompt'
                     handleChange={handlePromptChange}/>

          <CustomButton title="Submit&Publish" containerStyles='mb-7' handlePress={handleSubmit}/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create