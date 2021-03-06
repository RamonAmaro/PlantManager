import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IParams {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: "smile" | "hug";
  nextScreen: string;
}

const emojis = {
  hug: "🤗",
  smile: "😀",
};

export function ConfirmationUser() {
  const navigation = useNavigation();

  const routes = useRoute();

  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen,
  } = routes.params as IParams;

  const handleMoveOn = () => navigation.navigate(nextScreen);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}> {emojis[icon]} </Text>

        <Text style={styles.title}> {title} </Text>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.footer}>
          <Button onPress={handleMoveOn} title={buttonTitle} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: "center",
    color: colors.heading,
    lineHeight: 38,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    textAlign: "center",
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: colors.heading,
  },
  emoji: {
    fontSize: 100,
  },
  footer: {
    marginTop: 20,
    width: 280,
    alignItems: "center",
  },
});
