import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import { useRoute } from "@react-navigation/core";
import { useNavigation } from "@react-navigation/native";
import { isBefore } from "date-fns";
import { format } from "date-fns/esm";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { SvgFromUri } from "react-native-svg";
import waterDropImage from "../assets/waterdrop.png";
import { Button } from "../components/Button";
import { IPlants, plantSave } from "../libs/storage";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface Params {
  plant: IPlants;
}

export function PlantSave() {
  const route = useRoute();

  const navigation = useNavigation();

  const { plant } = route.params as Params;

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === "android") {
      setShowDatePicker((oldState) => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTime(new Date());
      return Alert.alert("Escolha uma hora no futuro ⏰");
    }

    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker((oldState) => !oldState);
  }

  async function handleSave() {
    try {
      await plantSave({
        ...plant,
        dateTimeNotification: selectedDateTime,
      });

      navigation.navigate("confirmation", {
        title: "Tudo certo.",
        subtitle:
          "Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha.",
        buttonTitle: "Muito Obrigado :D",
        icon: "hug",
        nextScreen: "myplants",
      });
    } catch {
      Alert.alert("Nao foi possivel salvar. 😓");
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri uri={plant.photo} height={150} width={150} />

          <Text style={styles.plantName}> {plant.name} </Text>
          <Text style={styles.plantAbout}>{plant.about}</Text>
        </View>

        <View style={styles.controllers}>
          <View style={styles.tipContainer}>
            <Image source={waterDropImage} style={styles.tipImage} />
            <Text style={styles.tipText}>{plant.water_tips}</Text>
          </View>

          <Text style={styles.alertLabel}>
            Escolha o melhor horario para ser lembrado:
          </Text>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDateTime}
              mode="time"
              display="spinner"
              is24Hour={true}
              onChange={handleChangeTime}
            />
          )}

          {Platform.OS === "android" && (
            <TouchableOpacity
              style={styles.dateTimePickerButton}
              onPress={handleOpenDateTimePickerForAndroid}
            >
              <Text style={styles.dateTimePickerText}>{`Mudar Horário ${format(
                selectedDateTime,
                "HH:mm"
              )}`}</Text>
            </TouchableOpacity>
          )}

          <Button onPress={handleSave} title="Cadastrar Planta" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.shape,
  },
  controllers: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  plantName: {
    textAlign: "center",
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantAbout: {
    textAlign: "center",
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  tipContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: "relative",
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: "justify",
  },
  alertLabel: {
    textAlign: "center",
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  dateTimePickerButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
