import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ConfirmationUser } from "../pages/Confirmation";
import { PlantSave } from "../pages/PlantSave";
import { UserIdentify } from "../pages/UserIdentify";
import { Welcome } from "../pages/Welcome";
import colors from "../styles/colors";
import AuthRoutes from "./tab.routes";

export const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => {
  return (
    <stackRoutes.Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      <stackRoutes.Screen name="welcome" component={Welcome} />
      <stackRoutes.Screen name="useridentify" component={UserIdentify} />
      <stackRoutes.Screen name="confirmation" component={ConfirmationUser} />
      <stackRoutes.Screen name="plantsselect" component={AuthRoutes} />
      <stackRoutes.Screen name="plantsave" component={PlantSave} />
      <stackRoutes.Screen name="myplants" component={AuthRoutes} />
    </stackRoutes.Navigator>
  );
};

export default AppRoutes;
