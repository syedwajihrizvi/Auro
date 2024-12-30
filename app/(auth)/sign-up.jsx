import { View, Text , ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomInput from '../../components/CustomInput'
import { icons, images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { registerUser } from '../../lib/appwrite'

const SignUp = () => {
  const [userInfo, setUserInfo] = useState({username: '', email: '', password: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleUsernameChange = (value) => {
    setUserInfo((prev) => ({...prev, username: value}))
  }

  const handleEmailChange = (value) => {
    setUserInfo((prev) => ({...prev, email: value}))
  }

  const handlePasswordChange = (value) => {
    setUserInfo((prev) => ({...prev, password: value}))
  }

  const submit = () => {
    const { username, email, password } = userInfo
    if (!username || !email || !password)
      Alert.alert("Invalid Details", "Please enter valid details")
    setIsSubmitting(true)
    registerUser(username, email, password)
    .then(() => {
      console.log("Successfull created user")
      router.push('/home')
    })
    .catch(err => {
      Alert.alert('Error', err.message)
    })
    .finally(() => {
      setIsSubmitting(false)
    })
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='px-10 w-full justify-center min-h-[80vh] py-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[140px] h-[90px] mb-10'/>
          <Text className='text-white text-3xl font-psemibold mb-10'>Sign Up</Text>
          <CustomInput label="Username" containerStyles="mb-6" handleChange={handleUsernameChange}/>
          <CustomInput label="Email" containerStyles="mb-6" handleChange={handleEmailChange}/>
          <CustomInput label="Password" containerStyles="mb-6" 
                       secureTextEntry={true} handleChange={handlePasswordChange}>
            <Image source={icons.eye} className='size-6'/>
          </CustomInput>
          <TouchableOpacity>
            <Text className='text-gray-100 text-1xlfont-pregular text-right mb-6'>Forgot Password</Text>
          </TouchableOpacity>
          <CustomButton title="Sign Up" containerStyles="mb-3" isLoading={isSubmitting} handlePress={submit}/>
          <Text className='text-gray-100 text-center text-lg'>
            Already have an account? 
            <Link href="/sign-in"><Text className='text-secondary-100 font-pregular'> Sign In</Text></Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp