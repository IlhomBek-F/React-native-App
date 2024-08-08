import { images } from "@/constants";
import React from "react";
import {Text, Image, View} from "react-native";
import Button from "./Button";
import { router } from "expo-router";

function EmptyState() {

    return (
        <View className="justify-center items-center px-44">
            <Image source={images.empty} className="w-[270px] h-[215px]" resizeMode="contain"/>
            <Text className="font-medium text-sm text-gray-100">{'sad'}</Text>
            <Text className="font-psemibold text-xl text-center text-white mt-2">{'asdasd'}</Text>

            <Button title="Create video" handlePress={() => router.push('/create')} containerStyle="w-full m-5"/>
        </View>
    )
}

export default EmptyState;