import { AppColors } from "@/constants/app-colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: AppColors.background },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
});
