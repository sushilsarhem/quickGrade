import { View, Text,TouchableOpacity,FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '@/context/GlobalProvider';
import { fetchMyStudents } from '@/config/appwriteConfig';

const Students = () => {

  const {user} = useContext(UserContext);
  const [myStudents,setMyStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const pullStudents = async () => {
    if (!user) {
      console.log('User context is not available');
      return;
    }
  
    try {
      setLoading(true); // Set loading to true while fetching
      const studentClass = user.standard;
      const section = user.section;
  
      const result = await fetchMyStudents(studentClass, section);
      const retrievedStudentList = result.documents || []; // Ensure it's an array
  
      // Sort by rollno in ascending order
      const sortedStudents = retrievedStudentList.sort((a, b) => a.rollno - b.rollno);
  
      setMyStudents(sortedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false); // Always stop loading after fetching
    }
  };
  

  useEffect(()=>{
    pullStudents();
  },[])
  return (
    <View className='flex-1 justify-center bg-zinc-800'>
        <Text className='text-yellow-400 text-3xl text-center my-2'>Students</Text>

        

        <FlatList
             className='my-1 m-3'
            data={myStudents}
            keyExtractor={(item) => item.$id} // Use a unique identifier for each item
            renderItem={({ item }) => (
          <View className="flex flex-row bg-black p-3 m-2 rounded-lg">
                            <View className="w-5/6">
                                <Text className="text-gray-400" numberOfLines={1} ellipsizeMode="tail">
                                          {`Name: `}
                                    <Text className="text-white text-lg font-bold">{item.name || 'Unknown Name'}</Text>
                                </Text>
                                <Text className="text-gray-400">{`Class: `}
                                    <Text className="text-white text-lg font-bold">{item.class || 'Unknown'}</Text>
                                </Text>
                                <Text className="text-gray-400">{`Section: `}
                                    <Text className="text-white text-lg font-bold">{item.section}</Text>
                                </Text>
                            </View>
                            <View className={`${item.status === "FAIL" ? 'bg-red-700' : 'bg-teal-700'} flex-1 justify-center items-center w-1/6 rounded-lg`}>
                                <Text className="text-white font-bold text-3xl">{item.rollno}</Text>
                                    <Text className="text-white text-sm">Roll no.</Text>
                            </View>
                      </View>
        )}
          ListEmptyComponent={
          !loading && (
            <Text className="text-center text-gray-400 mt-4">
              No students found.
            </Text>
          )
        }
      />

      <View className="relative bottom-0 w-full my-0 py-0 ">
        <TouchableOpacity className={`${
            loading ? 'bg-gray-700' : 'bg-teal-700'
          } w-100 h-auto p-3 rounded-lg my-0`}
                          onPress={pullStudents} disabled={loading}>
                          <Text className='text-center text-3xl text-white bg-primary'>{loading ? 'Loading...' : 'Refresh'}</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default Students