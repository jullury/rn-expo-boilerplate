import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RefObject, useMemo } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primitives } from "@/theme";

type AppBottomSheetProps = {
  sheetRef: RefObject<BottomSheet | null>;
  title: string;
  children?: React.ReactNode;
};

export function AppBottomSheet({
  sheetRef,
  title,
  children,
}: AppBottomSheetProps) {
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetView style={styles.content}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedView>{children}</ThemedView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: primitives.spacing[16],
    gap: primitives.spacing[12],
  },
});
