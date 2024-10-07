import {NativeModules, Button, Text, View} from 'react-native';
import React, {useState} from 'react';
import {LogLevel, OneSignal} from 'react-native-onesignal';
const {BluetoothPrinter, USBPrinter} = NativeModules;

export default function App() {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  OneSignal.initialize('b51a4c39-d728-4338-b117-6435fd2b3137');

  OneSignal.Notifications.requestPermission(true);

  OneSignal.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event);
  });

  const [pairedPrinters, setPairedPrinters] = useState([]);
  const [status, setStatus] = useState('');

  const getPairedPrinters = async () => {
    try {
      const printers = await BluetoothPrinter.getPairedPrinters();
      setPairedPrinters(printers);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToUsbPrinter = async () => {
    try {
      await USBPrinter.connectToUsbPrinter();
      setStatus(`Connected to USB printer`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to connect to printer');
    }
  };

  const printTextUsingUSB = async () => {
    try {
      await USBPrinter.printText('Hello, this is a test print!');
      setStatus('Printed successfully');
    } catch (error) {
      console.error(error);
      setStatus('Print failed');
    }
  };

  const connectToBltPrinter = async (printerName: string) => {
    try {
      await BluetoothPrinter.connectToPrinter(printerName);
      setStatus(`Connected to ${printerName}`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to connect to printer');
    }
  };

  const printTextUsingBlt = async () => {
    try {
      await BluetoothPrinter.printText('Hello, this is a test print!');
      setStatus('Printed successfully');
    } catch (error) {
      console.error(error);
      setStatus('Print failed');
    }
  };

  return (
    <View>
      <Button title="Get Paired Printers" onPress={getPairedPrinters} />
      {pairedPrinters.length > 0 && (
        <Button
          title={`Connect to ${pairedPrinters[0]}`}
          onPress={() => connectToBltPrinter(pairedPrinters[0])}
        />
      )}
      <Button title="Print Text" onPress={printTextUsingBlt} />
      <Text>{status}</Text>

      <Button title={`Connect to USB Printer`} onPress={connectToUsbPrinter} />
      <Button title="Print Text" onPress={printTextUsingUSB} />
      <Text>{status}</Text>
    </View>
  );
}
