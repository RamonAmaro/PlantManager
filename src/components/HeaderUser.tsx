import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserImage from "../assets/amaro.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function HeaderUser() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem("@plantManager:user");

      setUserName(user || "");
    }
    loadStorageUserName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.greeting}> Olá, </Text>
        <Text style={styles.username}>{userName} </Text>
      </View>

      <Image source={UserImage} style={styles.image} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});
