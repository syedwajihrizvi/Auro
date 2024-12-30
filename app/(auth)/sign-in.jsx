import { View, Text , ScrollView, Image, TouchableOpacity, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signIn } from '../../lib/appwrite'
import CustomInput from '../../components/CustomInput'
import { icons, images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({email: '', password: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleEmailChange = (value) => {
    setUserInfo((prev) => ({...prev, email: value}))
  }

  const handlePasswordChange = (value) => {
    setUserInfo((prev) => ({...prev, password: value}))
  }

  const handleSignIn = () => {
    const { email, password } = userInfo
    if (!email || !password)
      Alert.alert("Invalid Details", "Please enter valid details")
    setIsSubmitting(true)
    signIn(userInfo.email, userInfo.password)
    .then(() => {
      console.log("Successfully signed in")
      router.push('/home')}
    )
    .catch(err => Alert.alert("Sign In Error", err.message))
    .finally(() => setIsSubmitting(false))
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='px-10 w-full justify-center min-h-[80vh] py-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[140px] h-[90px] mb-10'/>
          <Text className='text-white text-3xl font-psemibold mb-10'>Sign In</Text>
          <CustomInput label="Email" containerStyles="mb-6" handleChange={handleEmailChange}/>
          <CustomInput label="Password" containerStyles="mb-6" 
                       secureTextEntry={true} handleChange={handlePasswordChange}>
            <Image source={icons.eye} className='size-6'/>
          </CustomInput>
          <TouchableOpacity>
            <Text className='text-gray-100 text-1xlfont-pregular text-right mb-6'>Forgot Password</Text>
          </TouchableOpacity>
          <CustomButton title="Sign In" containerStyles="mb-3" isLoading={isSubmitting} handlePress={handleSignIn}/>
          <Text className='text-gray-100 text-center text-lg'>
            Don't have an account? 
            <Link href="/sign-up"><Text className='text-secondary-100 font-pregular'> Sign Up</Text></Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn