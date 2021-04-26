import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import waterDropImage from "../assets/waterdrop.png";
import { HeaderUser } from "../components/HeaderUser";
import { Loading } from "../components/Loading";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { deletePlant, IPlants, loadPlants } from "../libs/storage";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<IPlants[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState("");

  useEffect(() => {
    async function loadStorage() {
      const plantsStoraged = await loadPlants();

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} á aproxidamente ${nextTime}.`
      );
      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStorage();
  }, []);

  function handleRemove(plant: IPlants) {
    Alert.alert("Remover", `Deseja remover a ${plant.name} ?`, [
      { text: "Não 🙏🏻", style: "cancel" },
      {
        text: "Sim 😿",
        onPress: async () => {
          try {
            await deletePlant(plant.id);

            setMyPlants((oldData) =>
              oldData.filter((item) => item.id !== plant.id)
            );
          } catch (error) {
            Alert.alert(" Nao foi possivel remover", error);
          }
        },
      },
    ]);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <HeaderUser />
      <View style={styles.spotlight}>
        <Image source={waterDropImage} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}> {nextWatered} </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Proximas Regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 40,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
