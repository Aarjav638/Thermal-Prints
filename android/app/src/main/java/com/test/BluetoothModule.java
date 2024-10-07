package com.test;

import BpPrinter.mylibrary.BluetoothConnectivity;
import BpPrinter.mylibrary.BpPrinter;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import java.io.IOException;
import java.util.List;

public class BluetoothModule extends ReactContextBaseJavaModule  {
    private BluetoothConnectivity m_AemScrybeDevice;
    private BpPrinter m_AemPrinter;
    private Context context;

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);`
        this.context = reactContext;
        m_AemScrybeDevice = new BluetoothConnectivity(reactContext);
    }

    @Override
    public String getName() {
        return "BluetoothModule";
    }

    // Method to get a list of paired printers
    @ReactMethod
    public void getPairedPrinters(Promise promise) {
        try {
            Object pairedPrintersObj = m_AemScrybeDevice.getPairedPrinters();
            if (pairedPrintersObj instanceof List) {
                List<String> pairedPrinters = (List<String>) pairedPrintersObj;
                WritableArray printerArray = new WritableNativeArray();
                for (String printer : pairedPrinters) {
                    printerArray.pushString(printer);
                }
                promise.resolve(printerArray);
            } else {
                promise.reject("ERROR", "Paired printers not found");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // Connect to a Bluetooth printer by name
    @ReactMethod
    public void connectToBluetoothPrinter(String printerName, Promise promise) {
        try {
            if (m_AemScrybeDevice.connectToPrinter(printerName)) {
                m_AemPrinter = m_AemScrybeDevice.getAemPrinter();
                promise.resolve(true);
            } else {
                promise.reject("ERROR", "Bluetooth Printer not connected");
            }
        } catch (IOException e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // Print text using the connected Bluetooth printer
    @ReactMethod
    public void printText(String text, Promise promise) {
        try {
            if (m_AemPrinter != null) {
                m_AemPrinter.print(text);
                promise.resolve(true);
            } else {
                promise.reject("ERROR", "Printer is not connected");
            }
        } catch (IOException e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // Disconnect from the Bluetooth printer
    @ReactMethod
    public void disconnectBluetoothPrinter(Promise promise) {
        try {
            if (m_AemScrybeDevice != null) {
                m_AemScrybeDevice.disConnectPrinter();
                promise.resolve(true);
            } else {
                promise.reject("ERROR", "Bluetooth Printer not connected");
            }
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
}
