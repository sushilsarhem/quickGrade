import { View, Text,ActivityIndicator, TextInput, ScrollView,TouchableOpacity, Alert  } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { checkStudentExist,fetchAssessmentDetails,saveMarks,updateMarks,formatAsssesmentName } from "@/config/appwriteConfig";
import { useEffect, useState,useContext } from "react";
import { UserContext } from "@/context/GlobalProvider";
import { useRouter } from "expo-router";

const EnterMarksDetails = () => {
  const { studentId,name, studentClass,section,rollno,assestType } = useLocalSearchParams(); // Get params from the URL
  const [studentData,setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(UserContext);
  const [allowedSubjects,setAllowedSubjects] = useState([]);
  const [passMark,setPassMark]= useState("");
  const [fullMark,setFullMark]= useState("");
  const [offeredSubjects,setOfferedSubjects] =useState([]);
  const router = useRouter();


  const handleInputChange = (subjectName,marks) =>{
    
    setOfferedSubjects((prevValu) =>
      prevValu.map((subject) =>
        subject.hasOwnProperty(subjectName)
          ? { [subjectName]: marks }
          : subject
      )
    );
    
  }

  const handleSubmit =async ()=>{
    const docId = studentData?.[0]?.$id;
    
    if(docId && offeredSubjects && assestType){
      const updateData = await updateMarks(docId,offeredSubjects,assestType,fullMark,name,studentClass,section,rollno)
      if(updateData){
        Alert.alert("Success", "Data successfully Updated!")
        await loadData(); // Fetch updated data
      }
    }

    if(!docId && offeredSubjects && assestType){
      const teacherId=user.$id
      const saveData = await saveMarks(name,studentClass,section,rollno,teacherId,offeredSubjects,assestType,fullMark)
      if(saveData){
        Alert.alert("Success", "Data successfully Saved!")
        await loadData(); // Fetch updated data
      }
    }
  }


  const loadData = async () => {
    if (!user) return; // Wait for user data

    try {
      const teacherId = user.$id;
      const res = await fetchAssessmentDetails(teacherId, assestType);
      const assessment = res.documents[0];

      // console.log("Assessment subjects:", assessment.subjects);

      setAllowedSubjects(assessment.subjects);
      setPassMark(assessment.passmark);
      setFullMark(assessment.fullmark);

      if (studentId) {
        const studentRes = await checkStudentExist(studentId, name, studentClass, section, rollno, assestType);
        // console.log(studentRes); 
        
        let newOfferedSubjects = [];
        
        // Filter student subjects to match allowed subjects and log matching key-value pairs
        if (studentRes?.length) {
          assessment.subjects.forEach((subject) => {
            studentRes.forEach((stud) => {
              Object.entries(stud).forEach(([key, value]) => {
                if (key === subject) {
                  newOfferedSubjects.push({ [key]: value });
                }
              });
            });
          });
        }
        
        if (!studentRes) {
          assessment.subjects.forEach((subject) => {
            newOfferedSubjects.push({ [subject]: "" });
          });
        }
     
        setStudentData(studentRes);
        setOfferedSubjects(newOfferedSubjects);
      }
      
    
    } catch (error) {
      return false;
      // console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading after all data is fetched
    }
  };

  useEffect(() => {
    

    loadData();
  }, [user, studentId]); // Only trigger when `user` or `studentId` changes

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-800">
        <ActivityIndicator size="large" color="#facc15" />
        <Text className="text-yellow-400 mt-3">Loading data...</Text>
      </View>
    );
  }
  

  return (
      <View className="flex-1 bg-zinc-800">

        <ScrollView className="w-full">
        {assestType ? (
          <Text className='text-yellow-400 text-xl text-center my-3'>
          {`${formatAsssesmentName(assestType)} entry for Roll no: ${rollno}`}
          </Text>
        ) : null}
        {passMark ? (
          <View className="flex flex-row items-center px-7 py-2">
          <Text className="text-white text-xl w-2/3">Pass Mark:</Text>
          <TextInput 
            placeholder={passMark !== undefined ? String(passMark) : "0"} 
            value={passMark !== undefined ? String(passMark) : ""}
            editable={false}
            // style={{backgroundColor:'#f4bdb6'}}
            placeholderTextColor="white"
            className="bg-slate-600 w-1/3 border-2 text-white border-white text-center text-3xl h-14 py-0 my-0"
          />
          </View>
        ):null}

        {fullMark ? (
          <View className="flex flex-row items-center px-7 py-2">
          <Text className="text-white text-xl w-2/3">Full Mark:</Text>
          <TextInput 
            placeholder={fullMark !== undefined ? String(fullMark) : "0"} 
            value={fullMark !== undefined ? String(fullMark) : ""}
            editable={false}
            // style={{backgroundColor:'#f4bdb6'}}
            placeholderTextColor="white"
            className="bg-slate-600 w-1/3 border-2 text-white border-white text-center text-3xl h-14 py-0 my-0"
          />
          </View>
        ):null}



        
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
                      className={`${
                        (["halfyearly", "final"].includes(assestType) && Number(subjectValue) < 34) || 
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

              {studentData && studentData.length >0 ?(
                studentData.map((data,index)=>{
                  
                  return (
                    <View key={index}>
                    <View className="flex flex-row items-center px-7 py-2">
                      <Text className="text-white text-xl w-2/3">Total</Text>
                        <TextInput
                          value={String(data.total)== "null"? "00":String(data.total)} // Ensure it's a string
                          className="w-1/3 border-2 border-white text-white text-center bg-slate-600 text-3xl h-14 py-0 px-0 my-0"
                          editable={false}
                          />
                    </View>

                    <View  className="flex flex-row items-center px-7 py-2">
                      <Text className="text-white text-xl w-2/3">Percentage</Text>
                        <TextInput
                          value={String(data.percentage)== "null"? "00":String(data.percentage)} // Ensure it's a string
                          className="w-1/3 border-2 border-white text-center bg-slate-600 text-white text-3xl h-14 py-0 px-0 my-0"
                          editable={false}
                          />
                    </View>

                    <View  className="flex flex-row items-center px-7 py-2">
                      <Text className="text-white text-xl w-2/3">Status</Text>
                        <TextInput
                          value={String(data.status)== "null"? "Nil":String(data.status)} // Ensure it's a string
                          className="w-1/3 border-2 border-white text-center bg-slate-600 text-white text-3xl h-14 py-0 my-0"
                          editable={false}
                          />
                          
                    </View>
                    </View>
                        )
                    })
                    ):(
                    null
                  )}

              <View className="flex my-5">
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="bg-teal-700 p-3 rounded-lg my-2 mx-5"
                  style={{ alignItems: "center" }}
                >
                  <Text className="text-white font-bold text-2xl p-0">Submit</Text>
                </TouchableOpacity>
              </View>

              


            </>
          ) : (
            <Text className="text-white font-bold text-2xl p-0">No subjects found!</Text>
          )

          
    
           
          }    
        
      </ScrollView>
       
      </View>
  );
};

export default EnterMarksDetails;
