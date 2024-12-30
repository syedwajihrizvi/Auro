import { View, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { WebView } from 'react-native-webview'
import { useVideoPlayer, VideoView } from 'expo-video'
import React, {useState} from 'react'
import { icons } from '../constants'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  }
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  }
}

const TrendingItem = ({activeItem, item}) => {
  const [play, setPlay] = useState(false)

  const handlePress = () => {
    setPlay(!play)
  }

  const injectedJavascript = `
  document.addEventListener('DOMContentLoaded', function() {
    var iframe = document.querySelector('iframe'); // Locate iframe after DOM is loaded
    if (iframe) {
      window.ReactNativeWebView.postMessage("Iframe found");
      var player = new Vimeo.Player(iframe);

      // Listen for 'ended' event
      player.on('ended', function() {
        window.ReactNativeWebView.postMessage("Video has ended");
      });
    } else {
      window.ReactNativeWebView.postMessage("Iframe not found after DOMContentLoaded");
    }
  });
  true;
`;
  const handleMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === "Video has ended") {
      Alert.alert("Video Ended", "The video has finished playing.");
    }
  };

  const isVideoVimeo = () => {
    return item.video.includes('vimeo')
  }

  const player = useVideoPlayer(!isVideoVimeo() ? {uri: item.video} : null, player => {
      player.loop = true;
      player.pause()
      player.muted
  })

  return (
    <Animatable.View className='mr-5' animation={item.$id == activeItem.$id ? zoomIn : zoomOut} duration={500}>
      {play ?
        (isVideoVimeo() ?
        <View className=" w-52 h-72 rounded-[35px] overflow-hidden">
          <WebView
            javaScriptEnabled={true}
            source={{
              uri: `${item.video}?autoplay=1&muted=1`,
            }}
            injectedJavaScript={injectedJavascript}
            onMessage={handleMessage}
            mediaPlaybackRequiresUserAction={false}
            style={{ resizeMode: 'cover', flex: 1, 
                    backgroundColor: 'black'}}   
          />
        </View> : 
        <VideoView style={{ width: 200, height: 200, borderRadius: 10 }} player={player}/>
        ): 
      <TouchableOpacity className='relative justify-center items-center' activeOpacity={0.7} onPress={handlePress}>
        <ImageBackground source={{uri: item.thumbnail}}
                         resizeMethod='cover'
                         className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black-40'/>
        <Image source={icons.play} className='absolute size-12'/>
      </TouchableOpacity>}
    </Animatable.View>
  )
}

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0])

  const onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems && viewableItems[0]) {
      const indexOfVisibleItem = viewableItems[0].index
      setActiveItem(posts[indexOfVisibleItem])
    }
  }

  return (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <TrendingItem activeItem={activeItem} item={item}/>
        )}
        horizontal
        contentContainerClassName='items-center justify-center px-20'
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={120}/>
  )
}

export default Trending