import React, {useReducer, useRef} from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const initialRouteName = 'New';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <AnimatedTabBar {...props} />}
          initialRouteName={initialRouteName}>
          <Tab.Screen
            name="History"
            component={PlaceholderScreen}
            options={{
              tabBarIcon: () => (
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path
                      fill="#000"
                      d="M19.5 12A7.5 7.5 0 0 0 6.9 6.5h1.35a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 1.5 0v1.042a9 9 0 1 1-2.895 5.331a.749.749 0 0 1 .752-.623c.46 0 .791.438.724.892A7.5 7.5 0 1 0 19.5 12Zm-7-4.25a.75.75 0 0 0-1.5 0v4.5c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H12.5V7.75Z"
                    />
                  </Svg>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name={initialRouteName}
            component={PlaceholderScreen}
            options={{
              tabBarIcon: () => (
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path fill="#000" d="M16 12h2v4h-2z" />
                    <Path
                      fill="#000"
                      d="M20 7V5c0-1.103-.897-2-2-2H5C3.346 3 2 4.346 2 6v12c0 2.201 1.794 3 3 3h15c1.103 0 2-.897 2-2V9c0-1.103-.897-2-2-2zM5 5h13v2H5a1.001 1.001 0 0 1 0-2zm15 14H5.012C4.55 18.988 4 18.805 4 18V8.815c.314.113.647.185 1 .185h15v10z"
                    />
                  </Svg>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={PlaceholderScreen}
            options={{
              tabBarIcon: () => (
                <View style={styles.iconContainer}>
                  <Svg width={24} height={24} viewBox="0 0 24 24">
                    <Path
                      fill="#000"
                      d="m19.85 8.75l4.15.83v4.84l-4.15.83l2.35 3.52l-3.43 3.43l-3.52-2.35l-.83 4.15H9.58l-.83-4.15l-3.52 2.35l-3.43-3.43l2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23L5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15l3.52-2.35l3.43 3.43l-2.35 3.52zm-1.57 5.07l4-.81v-2l-4-.81l-.54-1.3l2.29-3.43l-1.43-1.43l-3.43 2.29l-1.3-.54l-.81-4h-2l-.81 4l-1.3.54l-3.43-2.29l-1.43 1.43L6.38 8.9l-.54 1.3l-4 .81v2l4 .81l.54 1.3l-2.29 3.43l1.43 1.43l3.43-2.29l1.3.54l.81 4h2l.81-4l1.3-.54l3.43 2.29l1.43-1.43l-2.29-3.43l.54-1.3zm-8.186-4.672A3.43 3.43 0 0 1 12 8.57A3.44 3.44 0 0 1 15.43 12a3.43 3.43 0 1 1-5.336-2.852zm.956 4.274c.281.188.612.288.95.288A1.7 1.7 0 0 0 13.71 12a1.71 1.71 0 1 0-2.66 1.422z"
                    />
                  </Svg>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

const PlaceholderScreen = () => {
  // eslint-disable-next-line react-native/no-inline-styles
  return <View style={{flex: 1, backgroundColor: '#604AE6'}} />;
};

const AnimatedTabBar = ({
  state: {index: activeIndex, routes},
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const {bottom} = useSafeAreaInsets();

  // get information about the components position on the screen -----

  const reducer = (state: any, action: {x: number; index: number}) => {
    // Add the new value to the state
    return [...state, {x: action.x, index: action.index}];
  };

  const [layout, dispatch] = useReducer(reducer, []);
  console.log(layout);

  const handleLayout = (event: LayoutChangeEvent, index: number) => {
    dispatch({x: event.nativeEvent.layout.x, index});
  };

  // animations ------------------------------------------------------

  // get xOffset for the active tab
  const xOffset = useDerivedValue(() => {
    // Our code hasn't finished rendering yet, so we can't use the layout values
    if (layout.length !== routes.length) return 0;
    // We can use the layout values
    // Copy layout to avoid errors between different threads
    // We subtract 25 so the active background is centered behind our TabBar Components
    // 20 pixels is the width of the left part of the svg (the quarter circle outwards)
    // 5 pixels come from the little gap between the active background and the circle of the TabBar Components
    return [...layout].find(({index}) => index === activeIndex)!.x - 25;
    // Calculate the offset new if the activeIndex changes (e.g. when a new tab is selected)
    // or the layout changes (e.g. when the components haven't finished rendering yet)
  }, [activeIndex, layout]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      // translateX to the calculated offset with a smooth transition
      transform: [{translateX: withTiming(xOffset.value, {duration: 250})}],
    };
  });

  return (
    <View style={[styles.tabBar, {paddingBottom: bottom}]}>
      {/* curve bg */}
      <AnimatedSvg
        width={110}
        height={60}
        viewBox="0 0 110 60"
        style={[styles.activeBackground, animatedStyles]}>
        <Path
          fill="#604AE6"
          d="M20 0H0c11.046 0 20 8.954 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.046 8.954-20 20-20H20z"
        />
      </AnimatedSvg>

      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex;
          const {options} = descriptors[route.key];

          return (
            <TabBarComponent
              active={active}
              onLayout={event => handleLayout(event, index)}
              key={route.key}
              options={options}
              onPress={() => {
                navigation.navigate(route.name);
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

type TabBarComponentProps = {
  active?: boolean;
  onPress: () => void;
  options: BottomTabNavigationOptions;
  onLayout: (event: LayoutChangeEvent) => void;
};

// on pressable bug
const TabBarComponent = ({
  active,
  onPress,
  onLayout,
  options,
}: TabBarComponentProps) => {
  const ref = useRef(null);

  // animations ------------------------------------------------------

  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1 : 0, {duration: 250}),
        },
      ],
    };
  });

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.5, {duration: 250}),
    };
  });

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View
        style={[styles.componentCircle, animatedComponentCircleStyles]}
      />
      <Animated.View
        style={[styles.iconContainer, animatedIconContainerStyles]}>
        {options.tabBarIcon ? options.tabBarIcon({ref}) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  );
};

// ------
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});

export default App;
