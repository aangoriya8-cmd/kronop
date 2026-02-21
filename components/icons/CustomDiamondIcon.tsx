import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CustomDiamondIconProps {
  size?: number;
  color?: string;
}

const CustomDiamondIcon: React.FC<CustomDiamondIconProps> = ({ 
  size = 24, 
  color = '#FFFFFF' 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 7L12 22L21 7L12 2Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2L7 7L12 22L17 7L12 2Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 7H21L12 22L3 7Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomDiamondIcon;
