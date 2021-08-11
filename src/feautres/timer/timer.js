import React, { useState } from 'react';
import { Text, View, StyleSheet, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import {useKeepAwake} from 'expo-keep-awake';

import Countdown from '../../components/countdown';
import RoundedButton from '../../components/roundedButton';
import Timing from './timing';

import { colors } from '../../utils/colors';
import { spacing } from '../../utils/sizes';

const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const DEFAULT_TIME = 0.1;
  const [minutes, setMinutes] = useState(DEFAULT_TIME);
  const [isStarted, setIsStarted] = useState(false);
  const [progress, setProgress] = useState(1);

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    if(Platform.OS === "ios") {
      const interval = setInterval(()=> Vibration.vibrate(), 1000);
      setTimeout(()=> clearInterval(interval), 10000);
    } else {
      Vibration.vibrate(10000);
    }
  }

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
  };

  const onEnd = () => {
    vibrate();
    setMinutes(DEFAULT_TIME);
    setProgress(1);
    setIsStarted(false);
    onTimerEnd();
  }

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={{ paddingTop: spacing.xxl }}>
        <Text style={styles.title}>Focusing on:</Text>
        <Text style={styles.task}>{focusSubject}</Text>
        <View style={{ marginTop: 20, }}>
          <ProgressBar
            color="#5e84e2"
            progress={progress}
            style={{ height: 5 }}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Timing onChangeTime={changeTime} />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <RoundedButton
          title={isStarted ? 'pause' : 'start'}
          onPress={() => setIsStarted(!isStarted)}
        />
       
      </View>
       <View style={styles.clearSubject}>
        <RoundedButton title="-" size={50} onPress={()=> clearSubject()} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,

  },
  title: {
    color: colors.white,
    textAlign: 'center',
  },
  task: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdown: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flex:0.5,
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  }
});

export default Timer;
