import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useEffect } from 'react'
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native'
import { icons, images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { getQueriedPost } from '../../lib/appwrite'
import { useAppwrite } from '../../lib/hooks/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams, Link, router } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams()
  const {data: posts, refetch} = useAppwrite(() => getQueriedPost(query))
  
  useEffect(() => {
    refetch()
  }, [query])

  console.log(posts)
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
             <View className='justify-between items-start flex-row'>
                <View>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Image source={icons.rightArrow} className='size-4 rotate-180 mb-2'/>
                  </TouchableOpacity>
                  <Text className='font-pmedium text-sm text-gray-100'>Search results</Text>
                  <Text className='text-2xl font-psemibold text-white'>{query}</Text>
                </View> 
                <View>
                  <Link href='/home'>
                    <Image source={images.logoSmall} resizeMode='contain' className='w-9 h-10'/>
                  </Link>
                </View>
             </View>
             <SearchInput placeholder='Search for a video'/>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found for search" subtitle="Want to make one?" />
        )}/>
    </SafeAreaView>
  )
}

export default Search