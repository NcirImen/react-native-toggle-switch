import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

class ScrollSwitch extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      width: {
        left: 0,
        right: 0,
        indicator: INDICATOR_HEIGHT,
        viewPort: 0
      },
      height: {
        left: 0,
        right: 0,
        indicator: INDICATOR_HEIGHT,
        viewPort: 0
      },
      container: {
        left: this.props.active ? 0 : 0,
      },
      isActive: this.props.active || false
    };
    this.setLeftWidth = this.setDimensionhValues('left');
    this.SetRightWidth = this.setDimensionhValues('right');
    this.setViewPortWidth = this.setDimensionhValues('viewPort');
    // this.value = new Animated.Value(1);
    // this.lastLeft = 0;
  }

  componentDidMount() {
    if (!this.props.active) {
      this.toggleSwitch();
    }
  }

  toggleActive = (active) => {
    this.setState(({isActive}) => ({
      isActive: active || !isActive
    }), () => {
      this.props.onValueChange(this.state.isActive);
    });
  }

  toggleSwitch = () => {
    const { isActive } = this.state;
    if (isActive) {
      this.scrolRef.scrollToEnd();
    } else {
      this.scrolRef.scrollTo({x: 0, y: 0, animated: true})
    }
    this.toggleActive();
  }

  animateSwitch = (value, cb = () => {}) => {
    // this.value.setValue(0);
    // Animated.timing(this.value, {
    //   toValue: value ? 1 : 0,
    //   duration: 1000
    // }).start(cb); 
  };

  setDimensionhValues = key => event => {
    const {width, height} = event.nativeEvent.layout;
    this.setState(prevState => ({
      width: {
        ...prevState.width,
        [key]: width
      },
      height: {
        ...prevState.height,
        [key]: height
      }
    }))
  }

  onDragEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    const { width: { left, indicator }, isActive } = this.state;
    console.log(e.nativeEvent, contentOffset, left)
    if(contentOffset.x > left / 2) {
      this.scrolRef.scrollToEnd();
      this.toggleActive(false);
    } else {
      this.scrolRef.scrollTo({x: 0, y: 0, animated: true})
      this.toggleActive(true);
    }
    this.setState({
      opacity: 1
    });
  }

  onDragStart = (e) => {
    this.setState({
      opacity: 0.5
    });
  }

  render() {
    const { text: { on = 'ON', off = 'OFF' }, color: { active, inactive, indicator }} = this.props;
    const { width, isActive, opacity, height: { viewPort: viewPortHeight } } = this.state;
    const left = isActive ? 0 : (width.left + 8) * -1;
    console.log(this.state);
    const viewPortWidth = Math.max(width.left, width.right) + width.indicator + 10 + viewPortHeight / 2 + 3;
    
    return (
      <View
        style={[
          styles.viewPort,
          { 
            width: viewPortWidth,
            backgroundColor: 'transparent',
            opacity: 1,
            borderColor: 'rgba(0,0,0,0.5)',
            borderRadius: viewPortHeight / 2,
            borderWidth: 1
          }
        ]}
        onLayout={ this.setViewPortWidth }>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={r => this.scrolRef = r}
          onScrollEndDrag={this.onDragEnd}
          onScrollBeginDrag={this.onDragStart}
          style={{ flexGrow: 1}}
        >
          <View
            style={[
              styles.container,
              { opacity, width: Math.max(width.left, width.right) * 2 + INDICATOR_HEIGHT + 5 + 10 + HEIGHT },
              { backgroundColor: isActive? active: inactive },
              
            ]}
          >
            <View
              style={[
                styles.activeView,
                { flex: on.length > off.length ? 0 : 1 }
              ]}
              onLayout={ this.setLeftWidth }
              >
              <Text style={{alignSelf: 'center', flexGrow: on.length > off.length ? 0 : 1, textAlign: 'center'}}>
                {on}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={this.toggleSwitch}>
              <View style={[styles.indicatorWrapper]}>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: indicator, borderColor: isActive ? active : inactive }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.inactiveView,
                { flex: on.length > off.length ? 1 : 0 }
              ]}
              onLayout={ this.SetRightWidth }
            >
              <Text style={{ alignSelf: 'center', flexGrow: on.length > off.length ? 1 : 0, textAlign: 'center'}}>
                {off}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const HEIGHT = 37;
const INDICATOR_HEIGHT = 32;
const styles = StyleSheet.create({
  viewPort: {
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  container: {
    position: 'relative',
    height: HEIGHT,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicatorWrapper:{
    width: INDICATOR_HEIGHT + 5,
    height: INDICATOR_HEIGHT + 5,
    borderRadius: (INDICATOR_HEIGHT + 5) / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    width: INDICATOR_HEIGHT,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  activeView: {
    marginRight: 5,
    marginLeft: HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inactiveView: {
    marginLeft: 5,
    marginRight: HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default ScrollSwitch;