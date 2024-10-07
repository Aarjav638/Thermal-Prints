package com.test;

import android.content.Context;
import BpPrinter.mylibrary.BpPrinter;
import BpPrinter.mylibrary.UsbConnectivity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;

public class USBModule extends ReactContextBaseJavaModule{
    private UsbConnectivity m_BpUsbDevice;
    private BpPrinter m_AemPrinter;
    private Context context;

    public USBModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        // Initialize USB Connectivity with activity context
        m_BpUsbDevice = new UsbConnectivity(reactContext,reactContext);
    }

    @Override
    public String getName() {
        return "USBModule";
    }

    // Connect to a USB printer
    @ReactMethod
    public void connectToUsbPrinter(Promise promise) {
        try {
            if (m_BpUsbDevice != null && m_BpUsbDevice.connectToPrinter()) {
                m_AemPrinter = m_BpUsbDevice.getUsbPrinter();
                promise.resolve(true);
            } else {
                promise.reject("ERROR", "USB Printer not connected");
            }
        } catch (IOException e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // Print text using the connected USB printer
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

    // Remove disconnect method as it's not available in SDK
}
