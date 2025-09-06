import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BoundingBoxOverlay = ({ predictions, containerStyle }) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  // Calculate scale factors based on container dimensions
  const containerWidth = containerStyle?.width || screenWidth;
  const containerHeight = containerStyle?.height || screenHeight;

  return (
    <View style={[styles.overlay, containerStyle]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        {predictions.map((prediction, index) => {
          const [x1, y1, x2, y2] = prediction.bbox;
          
          // Calculate scaled coordinates
          const scaleX = containerWidth / (containerWidth > containerHeight ? 640 : 480);
          const scaleY = containerHeight / (containerWidth > containerHeight ? 480 : 640);
          
          const scaledX = x1 * scaleX;
          const scaledY = y1 * scaleY;
          const scaledWidth = (x2 - x1) * scaleX;
          const scaledHeight = (y2 - y1) * scaleY;

          return (
            <React.Fragment key={index}>
              <Rect
                x={scaledX}
                y={scaledY}
                width={scaledWidth}
                height={scaledHeight}
                stroke="#00FF00"
                strokeWidth="2"
                fill="transparent"
              />
              <SvgText
                x={scaledX}
                y={scaledY > 20 ? scaledY - 5 : scaledY + 20}
                fontSize="14"
                fill="#00FF00"
                fontWeight="bold"
              >
                {prediction.class}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});

export default BoundingBoxOverlay;
