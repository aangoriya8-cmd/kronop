import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

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
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M12 1L2 8L12 23L22 8L12 1Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12 1L6 8L12 23L18 8L12 1Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M2 8H22L12 23L2 8Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
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
