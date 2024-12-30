import { View, Text, Image, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import { useVideoPlayer, VideoView } from 'expo-video'
import { icons } from '../constants'
import React, { useState } from 'react'

const VideoCard = ({video: {users, thumbnail, title, video}}) => {
  const [playing, setPlaying] = useState(false)

  const handlePress = () => {
    setPlaying(!playing)
  }

  const isVideoVimeo = () => {
    return video.includes('vimeo')
  }

  const player = useVideoPlayer(!isVideoVimeo() ? {uri: video} : null, player => {
      player.loop = true;
      player.pause()
      player.muted
  })

  return (
    <View className='w-full mb-10 gap-6 px-6'>
        <View className='w-full flex-row justify-between'>
            <View className='flex-row items-center gap-3 w-[70%]'>
                <Image source={{uri: users.avatar}} resizeMode='contain' 
                    className='size-14 rounded-lg border-secondary-100 border-2'/>
                <View>
                    <Text className='text-2xl font-psemibold text-white' numberOfLines={1}>
                    {title}
                    </Text>
                    <Text className='text-lg font-pmedium text-gray-100'>{users.username}</Text>
                </View>
            </View>
            <Image source={icons.menu} resizeMode='contain' className='size-6'/>
        </View>
        {playing ?
        (isVideoVimeo() ? 
        <View className=" w-full h-60 rounded-xl">
          <WebView
            javaScriptEnabled={true}
            source={{
              uri: `${video}?autoplay=1&muted=1`,
            }}
            mediaPlaybackRequiresUserAction={false}
            style={{ resizeMode: 'cover', flex: 1, backgroundColor: 'black'}}   
          />
        </View> : 
        <View className='justify-center items-center w-full h-60'>
          <VideoView style={{ width: '100%', height: '100%'}} player={player}/>
        </View>): 
        <TouchableOpacity onPress={handlePress} className='relative items-center justify-center' activeOpacity={0.7}>
            <Image source={{uri: thumbnail}} resizeMode='cover' className='w-full h-60 rounded-xl opacity-60'/>
            <Image source={icons.play} resizeMode='contain' className='size-12 absolute'/>
        </TouchableOpacity>
        }

    </View>
  )
}

export default VideoCard