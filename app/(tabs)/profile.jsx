import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect } from 'react'
import { FlatList, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { icons } from '../../constants'
import { getPostsForProfile, signOut } from '../../lib/appwrite'
import { useAppwrite } from '../../lib/hooks/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams, router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const Profile = () => {
  const { query } = useLocalSearchParams()
  const {setUser} = useGlobalContext()

  const {data: {posts, user}, refetch} = useAppwrite(() => getPostsForProfile())
  
  useEffect(() => {
    refetch()
  }, [query])

  const logout = async () => {
    await signOut()
    setUser(null)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4'>
              <View className='items-end'>
                <TouchableOpacity onPress={logout}>
                  <Image source={icons.logout} 
                        resizeMode='contain' 
                        className='size-8' tintColor='red'/>
                  </TouchableOpacity>
              </View>
              {user ? 
                <View className='justify-center items-center'>
    
                <Image source={{uri: user.avatar}} resizeMode='contain' 
                      className='size-14 rounded-lg border-secondary-100 border-2'/>
                <Text className='text-white text-2xl my-3 font-psemibold'>{user.username}</Text>
                <View className='gap-4 flex-row'>
                  <View className='items-center justify-center'>
                    <Text className='text-white text-2xl font-psemibold'>{posts.length}</Text>
                    <Text className='text-gray-100 text-lg font-p'>Posts</Text>
                  </View>
                  <View className='items-center justify-center'>
                    <Text className='text-white text-2xl font-psemibold'>4.7k</Text>
                    <Text className='text-gray-100 text-lg font-p'>Views</Text>
                  </View>
                </View>
              </View> : <ActivityIndicator/>}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className='items-center justify-center h-full'>
            <Text className='text-white text-3xl text-center'>Fetching Profile Posts</Text>
            <ActivityIndicator size='large' color='#FF9C01'/>
          </View>
        )}/>
    </SafeAreaView>
  )
}

export default Profile