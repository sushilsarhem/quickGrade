import { View, Text, FlatList, TouchableOpacity, Switch } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '@/context/GlobalProvider';
import { fetchSavedAssessmentList, deleteAssessment } from '@/config/appwriteConfig';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

const SavedList = () => {
  const { user } = useContext(UserContext);
  const [assessment, setAssessment] = useState([]);
  const [loading,setLoading] = useState(true);

  const formatAsssesmentName = (assessmentName)=>{
    let asstname;
    switch (assessmentName) {
      case "assessment1":
          asstname = "Assessment-1";
          break;
      case "assessment2":
          asstname = "Assessment-2";
          break;
      case "halfyearly":
          asstname = "Halfyearly";
          break;
      case "assessment3":
          asstname = "Assessment-3";
          break;
      case "assessment4":
          asstname = "Assessment-4";
          break;
      case "final":
          asstname = "Final";
          break;
      default:
          return "Invalid assessment type";
      }

  return asstname; 
  }

  const handleDelete = useCallback(async (documentId) => {
    if (!documentId) return;

    try {
      await deleteAssessment(documentId);
      setAssessment((prev) => prev.filter((item) => item.$id !== documentId)); // Remove from state
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  }, []);

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
    <View className="flex-1 bg-zinc-800 p-4">
      <Text className="text-white text-3xl text-center my-2">Saved Assessment List</Text>

      {assessment.length > 0 ? (
        <FlatList
          data={assessment}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View className="bg-black p-3 my-2 rounded-lg flex-row items-center justify-between">
              <Text className="text-white text-lg">
                
                  {formatAsssesmentName(item.assesstmentType)}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.$id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text className="text-white text-center mt-5">No assessments found</Text>
      )}
    </View>
  );
};

export default SavedList;
