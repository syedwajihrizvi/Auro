import { ScrollView, View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from "../components/CustomButton"
import { images } from '../constants';
import { StatusBar } from 'expo-status-bar';
import { router, Redirect } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { useEffect } from 'react';

export default function App() {
    const { isLoading, isLoggedIn } = useGlobalContext()

    if (!isLoading && isLoggedIn)
      return <Redirect href='/home'/>

    return (
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView>
          <View className='w-full justify-center items-center px-4 py-20'>
            <Image source={images.logo} resizeMode='contain' className='w-[130px] h-[84px]'/>
            <Image source={images.cards} resizeMode='contain' className='max-w-[380px] w-full h-[300px]'/>
          <View className='relative'>
            <Text className='text-white font-bold text-center relative' style={{fontSize: 32}}>
              Discover Endless {'\n'} Possibilities with <Text className='text-secondary-200'>Aora</Text>
            </Text>
            <Image source={images.path} resizeMode='contain' className='absolute -right-9 -bottom-2 max-w-[135px] h-[15px]'/>
          </View>
          <View>
            <Text className='mt-5 text-gray-100 text-center text-lg px-5 font-pregular'>Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora.</Text>
          </View>
            <CustomButton title="Continue with Email" isLoading={false} containerStyles='w-full mt-7' handlePress={() => router.push('/sign-in')}/>
          </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light'/>
      </SafeAreaView>
  );
}

