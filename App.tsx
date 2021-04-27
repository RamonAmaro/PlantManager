import {
  Jost_400Regular,
  Jost_600SemiBold,
  useFonts,
} from "@expo-google-fonts/jost";
import AppLoading from "expo-app-loading";
import * as Notitications from "expo-notifications";
import React, { useEffect } from "react";
import Routes from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    async function notications() {
      const data = await Notitications.getAllScheduledNotificationsAsync();
      console.log(" ######### Notifications Agendadas #############", data);
    }

    notications();
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  return <Routes />;
}
