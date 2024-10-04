import {View, NativeModules, Button, Alert} from 'react-native';
import React from 'react';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import ThermalPrinterModule from 'react-native-thermal-printer';
import {useNetInfo} from '@react-native-community/netinfo';
const App = () => {
  const [ipAddress, setIpAddress] = React.useState('');

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.initialize('b51a4c39-d728-4338-b117-6435fd2b3137');

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  const {CustomModule} = NativeModules;
  const netInfo = useNetInfo();
  const getIpAddress = React.useCallback(() => {
    try {
      if (netInfo.details && 'ipAddress' in netInfo.details) {
        setIpAddress(netInfo.details.ipAddress as string);
      } else {
        console.log('ipAddress not available');
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [netInfo.details]);

  React.useEffect(() => {
    getIpAddress();
  }, [getIpAddress, netInfo.isConnected]);

  const onpress = async () => {
    try {
      const res = await CustomModule.createEvent('Testing', 'Test Location');
      Alert.alert(
        'Response',
        `Event Name ${res.name} location ${res.location}`,
        [{text: 'OK'}],
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleNetworkPrint = async () => {
    console.log('ipAddress', ipAddress);
    ThermalPrinterModule.defaultConfig.ip = ipAddress;
    ThermalPrinterModule.defaultConfig.port = 9100;
    ThermalPrinterModule.defaultConfig.autoCut = false;
    ThermalPrinterModule.defaultConfig.timeout = 30000;
    try {
      console.log('Printing...');
      await ThermalPrinterModule.printTcp({payload: 'hello world'});
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log('Unknown error', err);
      }
      Alert.alert('No Printer Connected to the Network');
    }
  };

  const handleBluetoothPrint = async () => {
    try {
      console.log('Printing...');
      await ThermalPrinterModule.printBluetooth({payload: 'hello world'});
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log('Unknown error', err);
      }
      Alert.alert('No Printer Connected to the Bluetooth');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        gap: 15,
        alignItems: 'center',
      }}>
      <Button title="Invoke Native Module" onPress={onpress} />

      <Button
        title="Print Using Network Printer"
        onPress={handleNetworkPrint}
      />
      <Button
        title="Print Using Bluetooth Printer"
        onPress={handleBluetoothPrint}
      />
    </View>
  );
};

export default App;
