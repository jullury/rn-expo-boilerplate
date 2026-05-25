import { Modal, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { primitives } from "@/theme";

type AppModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
};

export function AppModal({
  visible,
  title,
  description,
  onClose,
}: AppModalProps) {
  const { t } = useTranslation("common");

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle">{title}</ThemedText>
          {description ? <ThemedText>{description}</ThemedText> : null}
          <Button label={t("close")} onPress={onClose} />
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: primitives.spacing[24],
  },
  card: {
    width: "100%",
    maxWidth: 460,
    borderRadius: primitives.radius.xl,
    padding: primitives.spacing[24],
    gap: primitives.spacing[16],
  },
});
