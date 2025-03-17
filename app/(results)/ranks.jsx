import { View, Text,ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { fetchAssessmentForRanks } from '@/config/appwriteConfig';

const Ranks = () => {
  const { assesstmentType, teacherId } = useLocalSearchParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAllListFromAssessment = async () => {
    const data = await fetchAssessmentForRanks(assesstmentType, teacherId);
    const sortedData = data.sort((a, b) => b.percentage - a.percentage);
    
    sortedData.forEach((student, index) => {
      student.rank = student.status === "PASS" ? index + 1 : 0;
    });
    setLoading(false);
    setStudents(sortedData);
  };

  useEffect(() => {
    fetchAllListFromAssessment();
  }, [assesstmentType, teacherId]);

  if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-zinc-800">
          <ActivityIndicator size="large" color="#facc15" />
          <Text className="text-yellow-400 mt-3">Loading data...</Text>
        </View>
      );
    }

  return (
    <View className='flex-1 bg-zinc-800'>
      <Text className='text-yellow-400 mt-4 text-3xl text-center my-2'>{`Ranks for ${assesstmentType}`}</Text>
      {students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push({ 
              pathname: "/(results)/[rankDetails]", 
              params: { studentDetail: JSON.stringify(item),assesstmentType:assesstmentType } })}
              className="mx-3 rounded-lg"
            >
              <View className="flex flex-row bg-black p-3 m-2 rounded-lg">
                <View className="w-5/6">
                  <Text className="text-gray-400" numberOfLines={1} ellipsizeMode="tail">
                    {`Name: `}
                    <Text className="text-white text-lg font-bold">{item.name || 'Unknown Name'}</Text>
                  </Text>
                  <Text className="text-gray-400">{`Roll no: `}
                    <Text className="text-white text-lg font-bold">{item.rollno || 'Unknown'}</Text>
                  </Text>
                  <Text className="text-gray-400">{`Percentage: `}
                    <Text className="text-white text-lg font-bold">{item.percentage ? `${item.percentage} %` : 'NIL'}</Text>
                  </Text>
                </View>
                <View className={`${item.status === "FAIL" ? 'bg-red-700' : 'bg-teal-700'} flex-1 justify-center items-center w-1/6 rounded-lg`}>
                  <Text className="text-white font-bold text-3xl">{item.rank}</Text>
                  <Text className="text-white text-sm">rank</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text className='text-white text-3xl text-center my-2'>No students found</Text>
      )}
    </View>
  );
};

export default Ranks;
