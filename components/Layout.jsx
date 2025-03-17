import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

const Layout = ({ children }) => {
    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar style="light" translucent={true} backgroundColor="transparent" />
            
            {children}
            
        </SafeAreaView>
    );
};

export default Layout;
