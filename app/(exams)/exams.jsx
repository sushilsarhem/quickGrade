import { View, Text, FlatList, TouchableOpacity, Switch } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '@/context/GlobalProvider';
import { fetchSavedAssessmentList,formatAsssesmentName } from '@/config/appwriteConfig';
import { ActivityIndicator } from 'react-native';
import {  useRouter } from 'expo-router';

const Exams = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [assessment, setAssessment] = useState([]);
  const [loading,setLoading] = useState(true);

  

  

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const data = await fetchSavedAssessmentList(user.$id);
        setAssessment(Array.isArray(data) ? data : [data]); // Convert object to array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
     return (
       <View className="flex-1 items-center justify-center bg-zinc-800">
         <ActivityIndicator size="large" color="teal" />
         <Text className="text-white mt-3">Loading assessments...</Text>
       </View>
     );
   }

  return (
    // <View className="flex-1 justify-center bg-slate-900 p-5">
    //   <Text className="text-yellow-400 text-center text-3xl m-3">Assessments</Text>

    //   {assessment.length > 0 ? (
    //     <FlatList
    //       data={assessment}
    //       keyExtractor={(item) => item.$id}
    //       renderItem={({ item }) => (
    //         <View className="">
              
    //           <TouchableOpacity  
    //             className="bg-teal-700 px-4 py-2 rounded-lg w-full items-center my-2"
    //             onPress={() => router.push({
    //             pathname: "/(exams)/assessment1",
    //             params: { assesstmentType: item.assesstmentType,
    //                       teacherId:item.teacherId,
    //                     }
    //             })}>
    //           <Text className="text-white text-2xl font-semibold">
    //             {formatAsssesmentName(item.assesstmentType)}
    //           </Text>
    //           </TouchableOpacity>
    //         </View>
    //       )}
    //     />
    //   ) : (
    //     <Text className="text-white text-center mt-5">No assessments found</Text>
    //   )}
    // </View>
    <View className='flex-1 justify-center bg-zinc-800'>
          <Text className='text-yellow-400 font-bold text-3xl text-center my-2'>Assessments</Text>
          {assessment.length > 0 ? (
           
                  assessment.map((item,index)=>(
                    <TouchableOpacity  
                    key={index}
                    className="bg-teal-700 py-3 rounded-lg my-2 m-5"
                    onPress={() => router.push({
                    pathname: "/(exams)/assessment1",
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
  );
};

export default Exams;
