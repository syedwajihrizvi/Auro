import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useCallback, useEffect } from 'react'
import { FlatList, Text, View, Image, RefreshControl, ActivityIndicator } from 'react-native'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import { useAppwrite } from '../../lib/hooks/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const {data: posts, refetch } = useAppwrite(getAllPosts)
  const {data: latestPosts} = useAppwrite(getLatestPosts)
  const [refreshing, setRefreshing] = useState(false)
  const { refreshUser } = useGlobalContext()

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])
  
  useEffect(() => {
    refreshUser()
  }, [])
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
            {refreshing && <ActivityIndicator color={'#FF9C01'} size='large'/>}
             <View className='justify-between items-start flex-row'>
                <View>
                  <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                  <Text className='text-2xl font-psemibold text-white'>JSMastery</Text>
                </View> 
                <View>
                  <Image source={images.logoSmall} resizeMode='contain' className='w-9 h-10'/>
                </View>
             </View>
             <SearchInput placeholder='Search for a video'/>
             <View className='w-full flex-1 pt-5 pb-8'>
                <Text className='text-gray-100 text-lg font-pbold'>Latest Videos</Text>
                <Trending posts={latestPosts ?? []}/>
             </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found" subtitle="Be the first one to upload a video!" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}/>
    </SafeAreaView>
  )
}

export default Home