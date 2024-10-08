import React, { useEffect, useState } from "react"
import { Text, SafeAreaView, FlatList, View, Image, RefreshControl, Alert} from "react-native"
import { images } from "@/constants";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import { deletePost, getAllPosts, getLatestPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import useAppwrite from "@/hooks/useAppwrite";
import { useUser } from "@/lib/context/userContext";

function Home() {
    const [refreshing, setRefresh] = useState(false);
    const {user: {currentUser}} = useUser();
    const {data: posts, loading: loadingPosts, refetch: refetchPosts} = useAppwrite(getAllPosts);
    const {data: latestPosts, loading: loadingLatestPosts, refetch: refetchLatestPosts} = useAppwrite(getLatestPosts);
    const [dataPosts, setPosts] = useState(posts);

    const onRefresh = async () => {
        setRefresh(() => true);
        await refetchLatestPosts();
        await refetchPosts();
        setRefresh(false)
    }

    useEffect(() => {
        setPosts(posts);
    }, [posts.length])

    const onChange = (text: string) => {

    }

    const handleDeletePost = (item: any) => {
        const videoId = item.video.match(/\/files\/([^/]+)\/view/)[1];
        const thumbnailId = item.thumbnail.match(/\/files\/([^/]+)\/preview/)[1];
        deletePost(item.$id, videoId, thumbnailId)
        .then(() => {
           const filtered = dataPosts.filter((it) => it.$id !== item.$id);
           setPosts(filtered);
          Alert.alert('Success', 'Video deleted successfully')
        })
    }

    return (
      <SafeAreaView className="bg-primary text-white h-full">
         <FlatList data={dataPosts} 
         key={1}
         keyExtractor={(item: any) => item?.$id}
         renderItem={({item}) => <VideoCard item={item} key={item.$id} handleDeletePost={() => handleDeletePost(item)}/>}
         ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
                <View className="flex-row justify-between items-start mb-6">
                    <View>
                        <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                        <Text className="text-2xl font-semibold text-white">{currentUser?.username}</Text>
                    </View>
                    <View className="mt-1.5">
                        <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain"/>
                    </View>
                </View>

                <SearchInput onChange={onChange}/>

                <View className="w-full flex-1 pt-5 pb-8">
                    <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
                    <Trending posts={latestPosts}/>
                </View>
            </View>
         )}
         ListEmptyComponent={<EmptyState />}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor='white' title='uploading' />}
        />
      </SafeAreaView>
    )
}

export default Home