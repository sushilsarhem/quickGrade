import { View, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useState, useContext } from "react";
import { UserContext } from "@/context/GlobalProvider";
import { fetchAssessmentDetails, checkStudentExist } from '@/config/appwriteConfig';

const RankDetails = () => {
  const { studentDetail: studentDetailString, assesstmentType } = useLocalSearchParams();
  // Parse the studentDetail JSON string into an object
  const studentDetail = studentDetailString ? JSON.parse(studentDetailString) : null;
  const { user } = useContext(UserContext);
  const [allowedSubjects, setAllowedSubjects] = useState([]);
  const [passMark, setPassMark] = useState("");
  const [fullMark, setFullMark] = useState("");
  const [offeredSubjects, setOfferedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    if (!user) return; // Wait for user data

    try {
      const teacherId = user.$id;
      const res = await fetchAssessmentDetails(teacherId, assesstmentType);
      const assessment = res.documents[0];

      setAllowedSubjects(assessment.subjects);
      setPassMark(assessment.passmark);
      setFullMark(assessment.fullmark);

      const newOfferedSubjects = [];

      // Filter student subjects to match allowed subjects and log matching key-value pairs
      if (studentDetail) {
        // Iterate over the studentDetail object
        Object.entries(studentDetail).forEach(([key, value]) => {
          if (assessment.subjects.includes(key)) {
            newOfferedSubjects.push({ [key]: value });
          }
        });
      }
      setOfferedSubjects(newOfferedSubjects);
      setLoading(false)
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    loadData();
  }, [user]); // Only trigger when `user` or `studentId` changes

  useEffect(() => {
    if (studentDetail || allowedSubjects) {
      console.log(studentDetail);
    }
  }, []);

  if (offeredSubjects) {
    console.log("offered subj:", offeredSubjects);
  }

  if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-slate-900">
          <ActivityIndicator size="large" color="#facc15" />
          <Text className="text-yellow-400 mt-3">Loading data...</Text>
        </View>
      );
    }

  return (
    <ScrollView className="flex-1 bg-zinc-800">
      <Text className='text-yellow-400 text-xl text-center my-3'>Rank Details</Text>
      {passMark ? (
        <View className="flex flex-row items-center px-7 py-2">
          <Text className="text-white text-xl w-2/3">Pass Mark:</Text>
          <TextInput
            placeholder={passMark !== undefined ? String(passMark) : "0"}
            value={passMark !== undefined ? String(passMark) : ""}
            editable={false}
            placeholderTextColor="white"
            className="bg-slate-600 w-1/3 border-2 text-white border-white text-center text-3xl h-14 py-0 my-0"
          />
        </View>
      ) : null}

      {fullMark ? (
        <View className="flex flex-row items-center px-7 py-2">
          <Text className="text-white text-xl w-2/3">Full Mark:</Text>
          <TextInput
            placeholder={fullMark !== undefined ? String(fullMark) : "0"}
            value={fullMark !== undefined ? String(fullMark) : ""}
            editable={false}
            placeholderTextColor="white"
            className="bg-slate-600 w-1/3 border-2 text-white border-white text-center text-3xl h-14 py-0 my-0"
          />
        </View>
      ) : null}

      {Array.isArray(offeredSubjects) && offeredSubjects.length > 0 ? (
        <>
          {offeredSubjects.map((subject, index) => {
            const subjectName = Object.keys(subject)[0]; // Extract subject name
            const subjectValue = subject[subjectName];   // Extract subject value

            return (
              <View key={index} className="flex flex-row items-center px-7 py-2">
                <Text className="text-white text-xl w-2/3">{subjectName}</Text>
                <TextInput
                  placeholder="00"
                  value={String(subjectValue)} // Ensure it's a string
                  placeholderTextColor="white"
                  editable={false}
                  className={`${
                    (["halfyearly", "final"].includes(assesstmentType) && Number(subjectValue) < 34) ||
                    Number(subjectValue) < 7
                      ? 'bg-red-700'
                      : 'bg-teal-700'
                    } w-1/3 border-2 border-white text-center text-white text-3xl h-14 py-0 my-0`}
                  keyboardType="numeric"
                  cursorColor="white"
                  onChangeText={(newValue) => handleInputChange(subjectName, newValue)} // Correct function call
                />
              </View>
            );
          })}

          {/* Render studentDetail as an object */}
          {studentDetail && typeof studentDetail === 'object' && !Array.isArray(studentDetail) ? (
            <View>
              <View className="flex flex-row items-center px-7 py-2">
                <Text className="text-white text-xl w-2/3">Total</Text>
                <TextInput
                  value={String(studentDetail.total) === "null" ? "00" : String(studentDetail.total)} // Ensure it's a string
                  className="w-1/3 border-2 border-white text-white text-center bg-slate-600 text-3xl h-14 py-0 px-0 my-0"
                  editable={false}
                />
              </View>

              <View className="flex flex-row items-center px-7 py-2">
                <Text className="text-white text-xl w-2/3">Percentage</Text>
                <TextInput
                  value={String(studentDetail.percentage) === "null" ? "00" : String(studentDetail.percentage)} // Ensure it's a string
                  className="w-1/3 border-2 border-white text-center bg-slate-600 text-white text-3xl h-14 py-0 px-0 my-0"
                  editable={false}
                />
              </View>

              <View className="flex flex-row items-center px-7 py-2">
                <Text className="text-white text-xl w-2/3">Status</Text>
                <TextInput
                  value={String(studentDetail.status) === "null" ? "Nil" : String(studentDetail.status)} // Ensure it's a string
                  className="w-1/3 border-2 border-white text-center bg-slate-600 text-white text-3xl h-14 py-0 my-0"
                  editable={false}
                />
              </View>
            </View>
          ) : null}
        </>
      ) : (
        <Text className="text-white text-center text-2xl p-0">no student details found!</Text>
      )}
    </ScrollView>
  );
};

export default RankDetails;