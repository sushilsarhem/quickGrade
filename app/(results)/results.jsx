import { View, Text,ActivityIndicator, FlatList, TouchableOpacity, } from 'react-native'
import React from 'react'
import { useEffect, useState,useContext } from "react";
import { UserContext } from "@/context/GlobalProvider";
import { fetchSavedAssessmentList,formatAsssesmentName } from '@/config/appwriteConfig';
import {  useRouter } from 'expo-router';


const Results = () => {
    const [loading, setLoading] = useState(true);
    const {user} = useContext(UserContext);
    const [assessment, setAssessment] = useState([]);
    const router = useRouter();

    const loadData = async () => {
        if (!user) return; // Wait for user data
    
        try {
          const teacherId = user.$id;
          const res = await fetchSavedAssessmentList(teacherId);
          setAssessment(Array.isArray(res) ? res : [res]); // Convert object to array
          setLoading(false);
        //   const assessment = res.documents[0];
          console.log(res);
          
    
        } catch (error) {
          return false;
          // console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Stop loading after all data is fetched
        }
      };
    
      useEffect(() => {
        
    
        loadData();
      }, [user]);

      if (loading) {
          return (
            <View className="flex-1 items-center justify-center bg-zinc-800">
              <ActivityIndicator size="large" color="#facc15" />
              <Text className="text-yellow-400 mt-3">Loading data...</Text>
            </View>
          );
        }


  return (
    <View className='flex-1 justify-center bg-zinc-800'>
      <Text className='text-yellow-400 font-bold text-3xl text-center my-2'>Results</Text>
      {assessment.length > 0 ? (
       
              assessment.map((item,index)=>(
                <TouchableOpacity  
                key={index}
                className="bg-teal-700 py-3 rounded-lg my-2 m-5"
                onPress={() => router.push({
                pathname: "/(results)/ranks",
                params: { assesstmentType: item.assesstmentType,
                          teacherId:item.teacherId,
                        }
                })}>
              <Text className="text-white text-center text-2xl font-semibold">
                {formatAsssesmentName(item.assesstmentType)}
              </Text>
              </TouchableOpacity>
              ))
              
          )
       : (
        <Text className="text-white text-center mt-5">No assessments found</Text>
      )}
    </View>
  )
}

export default Results;