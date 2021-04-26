import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";
import { HeaderUser } from "../components/HeaderUser";
import { Loading } from "../components/Loading";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { IPlants } from "../libs/storage";
import api from "../services/api";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface IEnviroments {
  key: string;
  title: string;
}

export function PlantsSelect() {
  const [enviroments, setEnviroments] = useState<IEnviroments[]>([]);
  const [plants, setPlants] = useState<IPlants[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<IPlants[]>([]);
  const [enviromentSelected, setEnviromentSelected] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api.get(
      `/plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );
    if (!data) return setLoading(true);
    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((value) => [...value, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  }

  function handleEnviromentSelected(enviroment: string) {
    setEnviromentSelected(enviroment);

    if (enviroment === "all") {
      return setFilteredPlants(plants);
    }
    const filtered = plants.filter((plant) =>
      plant.environments.includes(enviroment)
    );

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: IPlants) {
    navigation.navigate("plantsave", { plant });
  }

  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get(
        "/plants_environments?_sort=title&_order=asc"
      );

      setEnviroments([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }
    fetchEnviroment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [page]);

  if (loading) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderUser />
        <View style={styles.box}>
          <Text style={styles.title}> Em qual ambiente </Text>
          <Text style={styles.subtitle}> você quer colocar sua planta ? </Text>
        </View>

        <FlatList
          data={enviroments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={enviromentSelected === item.key}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PlantCardPrimary
            data={item}
            onPress={() => handlePlantSelect(item)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        onEndReachedThreshold={0.1}
        onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color={colors.green} /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  box: {
    marginTop: 20,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  header: {
    paddingHorizontal: 25,
  },
  enviromentList: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginVertical: 32,
  },
  plants: {},
  contentContainerStyle: {
    paddingHorizontal: 20,
  },
});
