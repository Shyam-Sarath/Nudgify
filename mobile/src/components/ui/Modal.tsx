import React from 'react';
import { Modal as RNModal, StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import Card from './Card';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export const Modal: React.FC<Props> = ({
  visible,
  onClose,
  children,
  contentStyle,
}) => {
  const { colors } = useTheme();

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable style={styles.contentWrapper} pointerEvents="box-none">
          <Card variant="elevated" style={[styles.card, contentStyle]}>
            {children}
          </Card>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 24,
  },
});
export default Modal;
