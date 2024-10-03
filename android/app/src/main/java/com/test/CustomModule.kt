package com.test

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import android.util.Log
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext

class CustomModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    @ReactMethod
    fun createEvent(name: String, location: String, promise: Promise) {
        Log.d("CustomModule", "Create event called with name: $name and location: $location")
        try {
            val map: WritableMap = Arguments.createMap()
            map.putString("message", "Event created successfully")
            map.putString("name", name)
            map.putString("location", location)

            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("EVENT_ERROR", e)
        }
    }

    override fun getName(): String {
        return "CustomModule"
    }
}
