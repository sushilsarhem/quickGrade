import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView,TextInput, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons"; // Import icons from Expo
import { UserContext } from "@/context/GlobalProvider";
import { submitSettings } from "@/config/appwriteConfig";

const Settings = () => {
    const {user}= useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [passMark, setPassMark] = useState("")
    const [fullMark, setFullMark] = useState("")
    

    const [items, setItems] = useState([
        { label: "Assessment 1", value: "assessment1" },
        { label: "Assessment 2", value: "assessment2" },
        { label: "Half-yearly", value: "halfyearly" },
        { label: "Assessment 3", value: "assessment3" },
        { label: "Assessment 4", value: "assessment4" },
        { label: "Final", value: "final" },
    ]);

    const subjects = [
        { id: "english1", label: "English 1" },
        { id: "english2", label: "English 2" },
        { id: "maths", label: "Maths" },
        { id: "meiteimayek", label: "Meitei Mayek" },
        { id: "science", label: "Science" },
        { id: "hindi", label: "Hindi" },
        { id: "socialscience", label: "Social Science" },
        { id: "computer", label: "Computer" },
        { id: "generalknowledge", label: "General Knowledge" },
        { id: "dictation", label: "Dictation" },
        { id: "moralvalue", label: "Moral Value" },
        { id: "handwriting", label: "Handwriting" },
        { id: "conversation", label: "Conversation" },
    ];

    const toggleSelection = (id) => {
        setSelectedSubjects((previousSubj) =>
            previousSubj.includes(id)
                ? previousSubj.filter((item) => item !== id)
                : [...previousSubj, id]
        );
    };

    // Submit function to log the selected value
    const handleSubmit = async() => {
        
        const settingsData = {
            "teacherId":user?user.$id:null,
            "assesstmentType": value,
            "subjects":selectedSubjects,
            "passmark":passMark,
            "fullmark":fullMark
        }
        
        const res = await submitSettings(settingsData);
        if(res){
            Alert.alert('Success', "Assessment Added!");
            setValue(null);
            setSelectedSubjects([]);
            setPassMark("");
            setFullMark("");
        }
        if(!res){
            Alert.alert('Error occurred', "Please fill in all the inputs!");
        }
    };

    return (
        // <View style={{ flex: 1, padding: 20}} className='bg-slate-900'>
            <ScrollView
                style={{ flex: 1, padding: 20,margin:0}} className='bg-zinc-800'
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text className="text-yellow-400 text-3xl text-center my-2">
                    Set Assessment
                </Text>

                <Text className="text-white text-xl my-2">Assessment:</Text>

                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder="Select an assessment"
                    listMode="SCROLLVIEW" // Prevents VirtualizedList nesting issue
                    style={{ backgroundColor: "#334155", borderColor: "#475569" }}
                    textStyle={{ color: "white" }}
                    dropDownContainerStyle={{
                        backgroundColor: "#1e293b",
                        borderColor: "#475569",
                    }}
                    ArrowUpIconComponent={() => (
                        <Ionicons name="chevron-up" size={20} color="white" />
                    )}
                    ArrowDownIconComponent={() => (
                        <Ionicons name="chevron-down" size={20} color="white" />
                    )}
                />
                <Text className='text-white text-xl my-2'>Pass Mark</Text>
                <TextInput className='w-1/3 border-2 border-white text-white text-xl' onChangeText={(newValu)=>setPassMark(newValu)} value={passMark} placeholder="000" placeholderTextColor="white" keyboardType="numeric" />
                <Text className='text-white text-xl my-2'>Full Mark</Text>
                <TextInput className='w-1/3 border-2 border-white text-white text-xl' onChangeText={(newValu)=>setFullMark(newValu)} value={fullMark} placeholder="000" placeholderTextColor="white" keyboardType="numeric" />
                

                {subjects.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleSelection(item.id)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: 5,
                        }}
                    >
                        <Ionicons
                            name={
                                selectedSubjects.includes(item.id)
                                    ? "checkbox"
                                    : "square-outline"
                            }
                            size={40}
                            color="green"
                        />
                        <Text className="text-white text-xl text-center my-2">
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={{ flex: 1,marginVertical:20}}>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-teal-700 p-3 rounded-lg my-2"
                    style={{ alignItems: "center" }}
                >
                    <Text className="text-white font-bold text-xl">Submit</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        // </View>
    );
};

export default Settings;
