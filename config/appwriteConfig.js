import { Alert } from 'react-native';
import { Client, Account, ID, Databases,Storage,Query } from 'react-native-appwrite';

const endpoint = process.env.EXPO_PUBLIC_ENDPOINT
const projectID = process.env.EXPO_PUBLIC_PROJECT_ID
const platform = process.env.EXPO_PUBLIC_PLATFORM
const databaseID = process.env.EXPO_PUBLIC_DATABASE_ID
const profileID = process.env.EXPO_PUBLIC_PROFILE_ID
const studentsID = process.env.EXPO_PUBLIC_STUDENTS_ID
const ast1 = process.env.EXPO_PUBLIC_ASSESSMENT_1
const ast2 = process.env.EXPO_PUBLIC_ASSESSMENT_2
const halfyearlyID = process.env.EXPO_PUBLIC_HALFYEARLY
const ast3 = process.env.EXPO_PUBLIC_ASSESSMENT_3
const ast4 = process.env.EXPO_PUBLIC_ASSESSMENT_4
const finalID = process.env.EXPO_PUBLIC_FINAL
const settingsID = process.env.EXPO_PUBLIC_SETTINGS_ID
const appURL = process.env.EXPO_APP_URL


const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectID)
    .setPlatform(platform);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);



    const signupApp = async(email, password, name, fullname, standard, phone, section)=>{
        try{
            const result = await account.create(ID.unique(),email,password,name);
            if(result && result.$id){
                const userId = result.$id;
                const session = await account.createEmailPasswordSession(email, password);

                // await account.createVerification('http://localhost');
                // console.log("verification email sent");

                const initializeProfile = await createProfile(userId,name,fullname,standard,email,phone,section)
                const fetchedUser =await getCurrentUser();
                // Alert.alert('Success', 'Signup successful!');
                // console.log(result);
                return fetchedUser;
            }
            
        }catch(error){
            // Alert.alert('Error', error.message || 'Signup failed');
            // console.log(error);
            return null;
        }
        
        
    }

    const loginApp = async (email,password) => {
        try {
            const response = await account.createEmailPasswordSession(email, password);
            const fetchedUser =await getCurrentUser();
            // Alert.alert('Success', `Welcome ${response.userId}`);
            // console.log('login success',response);
            return fetchedUser;
            
                        
        } catch (error) {
            // Alert.alert('Error',error.message);
            // console.log('login error:',error);  
            return null;
        }
        };

    

    const getCurrentUser=async()=>{
        try {
            const response= await account.get();
            // console.log(response);
            
            
            const accId = response.$id;

            // console.log(accId);
            
            const userProfile = await databases.getDocument(
                databaseID, // databaseId
                profileID, // profile collectionId
                accId, // documentId
                
            );
            // console.log(userProfile);
            
            return userProfile;
        } catch (error) {
            // console.log('Error:',error);
            return null;
        }
    }

    const appLogout = async () => {
        try {
            await account.deleteSession('current');
            // alert('Logged out successfully!');
            // console.error('Signed out');
        } catch (error) {
            // console.error('Logout failed', error);
        }
    };

    const createProfile = async(userId,name,fullname,standard,email,phone,section)=>{
        try {
            const response = await databases.createDocument(
                databaseID, // Database ID
                profileID, // profile Collection ID
                userId, // Document ID
                { name, fullname, standard, email, phone, section } // Data object
            );
            // console.log(response);
            return response;
        } catch (error) {
            console.error('Profile creation failed:', error);
            throw error;
        }
    };

    const updateProfile = async(userId,name,fullname,standard,email,phone,section)=>{
        try {
        const res = await databases.updateDocument(
            databaseID, // Database ID
            profileID, // profile Collection ID
            userId, // Document ID
            { name, fullname, standard, email, phone, section } // Data object
        );
            // console.log(res);
            return res;
        } catch (error) {
            // console.error('Profile update failed:', error);
            throw error;
        }
    };


    const fetchProfileData = async (userId)=>{
        const data = await databases.getDocument(
            databaseID, // databaseId
            profileID, // profile collectionId
            userId, // documentId
        );
        // console.log(data);
        
        return data;
    }
   

    const fetchMyStudents =async(studentClass,section)=>{
        try {
            const students = await databases.listDocuments(
                databaseID, // databaseId
                studentsID, // students collectionId
                [
                    Query.equal('class', [studentClass]),
                    Query.equal('section', [section]),

                ]
            );
            return students;
        } catch (error) {
            // console.log("error fetching student list:",error);
            return null;
        }
    }


    const checkAssessment = (assessType) => {
        let assessmentId;
    
        switch (assessType) {
            case "assessment1":
                assessmentId = ast1;
                break;
            case "assessment2":
                assessmentId = ast2;
                break;
            case "halfyearly":
                assessmentId = halfyearlyID;  
                break;
            case "assessment3":
                assessmentId = ast3;
                break;
            case "assessment4":
                assessmentId = ast4
                break;
            case "final":
                assessmentId = finalID;
                break;
            default:
                return "Invalid assessment type";
        }
    
        return assessmentId; // Return after the switch
    };
    
    

    const checkStudentExist= async(studentId,name, studentClass,section,rollno,assestType)=>{
        if(!studentId || !assestType){
            console.log("invalid parameters!");
            return null;
        }
        try {
            const assessmentId = checkAssessment(assestType);
            // console.log("clicked");
            // console.log("Current student ID is:",studentId);
            // console.log("Assessment is:",assestType);
            
            const result = await databases.listDocuments(
                databaseID, // databaseId
                assessmentId, // collectionId
                [
                    Query.equal("name", name),
                    Query.equal("class", parseInt(studentClass)),
                    Query.equal("section", section),
                    Query.equal("rollno", parseInt(rollno)),
                ] 
            );
            if(result.documents.length > 0){
                const data = result.documents;
                // console.log("Student's details from assessment entry:",result.documents);
                return data;
            
            }else{
                // console.log("The student entry does not exists!");
                return false;
                
            }
            
            
        } catch (error) {
            // console.log("no record for the student found!:",error);
            
        }
    }

    const submitSettings = async (settingsData) => {
        const { teacherId, assesstmentType, subjects, passmark, fullmark } = settingsData;
    
        if (!teacherId || !assesstmentType || !subjects?.length || !passmark || !fullmark) {
            // console.log("Invalid document data");
            return false;
        }
    
        try {
            const result = await databases.createDocument(
                databaseID, // databaseId
                settingsID, // settings collectionId
                ID.unique(), // documentId
                {
                    teacherId,
                    assesstmentType,
                    subjects,
                    passmark: Number(passmark),
                    fullmark: Number(fullmark),
                }
            );
    
            if (result) {
                // console.log("Assessment created!");
                return true;
            }
    
            // console.log("Error inserting setting");
            return false;
        } catch (error) {
            // console.error("Error:", error);
            return false;
        }
    };
    

    const fetchAssessmentDetails = async(teacherId,assestType)=>{
        if(!teacherId || !assestType){
            return false;
        }
        try {
            const result = await databases.listDocuments(
                databaseID, // databaseId
                settingsID, // settings collectionId
                [
                    Query.equal("teacherId", teacherId),
                    Query.equal("assesstmentType", assestType), 
                ] // queries (optional)
            );
            // console.log("Assessment detail:",result.documents);
            
            if (result) {
                return result;
                
            }
            
        } catch (error) {
            // console.log(error);
            return null;
        }
        
    }

    const fetchSavedAssessmentList = async(teacherId)=>{
        if(!teacherId){
            return false;
        }
        try {
            const result = await databases.listDocuments(
                databaseID, // databaseId
                settingsID, // settings collectionId
                [
                    Query.equal("teacherId", teacherId),
                ] 
            );
            const data = result.documents;
            // console.log(data);
            
            
            return data;
        } catch (error) {
            // console.log(error);
            return null;
        }
        
    }


    const deleteAssessment = async(documentId)=>{
        const result = await databases.deleteDocument(
             databaseID, // databaseId
             settingsID, // settings collectionId
             documentId // documentId
        );
        console.log("Assesement deleted!");
        
        return result;
        
    }

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

    const calculateTotal = (updateData)=>{
        const totalMarks = Object.values(updateData).reduce((sum,mark)=>sum + mark, 0 );
        // console.log(totalMarks);
        return totalMarks

    }

    const calculatePrecentage = (marksObtained,totalMarks, subjects)=>{
        const total =totalMarks*subjects ;
        // console.log("total:",total);
        // console.log("marksObtained:",marksObtained);
        
        
        const marks = (marksObtained / total) * 100;
        // console.log(marks.toFixed(2));
        
        return marks.toFixed(2);
    }


    const updateMarks = async (studentId, offeredSubjects,assestType,fullMark,studentname,studentclass,section,rollno) => {
        const assessmentId = checkAssessment(assestType);
        // console.log(studentId);
        let status="PASS"; // new added for testing status
        

        const subjectMarks = offeredSubjects.reduce((acc, obj) => {
            const key = Object.keys(obj)[0]; // Subject name
            acc[key] = parseInt(obj[key], 10); // Ensure integer
            return acc;
            }, {});
            // console.log("subjectMarks:",subjectMarks);
            
    
            // Compute total marks (sum of subject marks)
            const totalMarks = calculateTotal(subjectMarks);
    
            // Calculate percentage correctly
            const numSubjects = Object.keys(subjectMarks).length;
            const percent = calculatePrecentage(totalMarks, fullMark, numSubjects);
    
            // Construct the final object to save
            const updateData = {
                ...subjectMarks, // Add subject marks
                total: parseFloat(totalMarks),
                percentage: parseFloat(percent),
                status
            };

        // Convert all values to integers and merge into a single object
        // const updateData = Object.assign(
        //     {}, 
        //     ...offeredSubjects.map(obj => {
        //         const key = Object.keys(obj)[0]; // Extract subject name
        //         return { [key]: parseInt(obj[key], 10) }; // Ensure integer
        //     })
        // );

        // // Get the number of subjects
        // const numSubjects = Object.keys(updateData).length;

        // const totalMarks = calculateTotal(updateData)
        // // console.log(totalMarks);
        
        // // Merge totalMarks into updateData
        // updateData.total = parseFloat(totalMarks);

        // // calucale percentage
        // const percent = calculatePrecentage(totalMarks, fullMark,numSubjects)
        // console.log("Percentage:",percent);
        // // Merge percentage into updateData
        // updateData.percentage = parseFloat(percent);


        // different method of calculation for halfyearly and final
        const newObjectMarksforHY ={};
        const newObjectMarksforfinal ={};
        if(assestType == "halfyearly"){
            // pull marks for asst-1 and asst-2 in terms of 5
                // console.log("asst type:",assessmentId);
                
                try {
                    const convertedAsst1marksForHY=[];
                    const convertedAsst2marksForHY=[];
                    // assessment-1
                    const asst1 = await databases.listDocuments( 
                        databaseID, // databaseId
                        ast1, // assesst 1 collectionId
                        [
                            Query.equal("name", studentname),
                            Query.equal("class", parseInt(studentclass)),
                            Query.equal("section", section),
                            Query.equal("rollno", parseInt(rollno)),
                        ] 
                    );
                        const asst1Marks = asst1.documents;
                        
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst1Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst1marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst1marksForHY);
                        


                    if(asst1.documents.length >0){
                        // assessment-2
                        const asst2 = await databases.listDocuments( 
                            databaseID, // databaseId
                            ast2, // asst 2 collectionId
                            [
                                Query.equal("name", studentname),
                                Query.equal("class", parseInt(studentclass)),
                                Query.equal("section", section),
                                Query.equal("rollno", parseInt(rollno)),
                            ] 
                        );
                        
                        const asst2Marks = asst2.documents;
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst2Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst2marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst2marksForHY);


                        if(asst1 && asst2){
                            // console.log("calculated");
                            // console.log("halfyearly marks:",subjectMarks);
                            
                            Object.keys(subjectMarks).forEach((subject) => {
                                const mark1 = convertedAsst1marksForHY.find((ast1) => ast1[subject]);
                                const mark2 = convertedAsst2marksForHY.find((ast2) => ast2[subject]);
                        
                                if (mark1 && mark2) {
                                    const newMark = parseFloat(mark1[subject] + mark2[subject] + subjectMarks[subject]);
                                    // console.log("New Mark for", subject, ":", newMark);
                                    newObjectMarksforHY[subject] = newMark;
                                    
                                }
                            });
                            const totalMarks = calculateTotal(newObjectMarksforHY);

                            const percentage = calculatePrecentage(totalMarks, fullMark, numSubjects);
                            // console.log("Total before update:", totalMarks);
                            // console.log("Percentage before update:", percent);



                            const halfyearlyFinalData = {
                                // name: studentname,
                                // class: parseInt(studentclass),
                                // section: section,
                                // rollno: parseInt(rollno),
                                // teacherId: teacherId,
                                ...newObjectMarksforHY, // Add subject marks
                                total: parseFloat(totalMarks),
                                percentage: parseFloat(percentage),
                                status
                            };

                            for(let x in newObjectMarksforHY){
                                if(newObjectMarksforHY[x] < 34){
                                    status = "FAIL"
                                    break;
                                }
                            }
                            halfyearlyFinalData.status = status;

                            const result = await databases.updateDocument(
                                 databaseID, // databaseId
                                 halfyearlyID, // half yearly collectionId
                                 studentId, // documentId
                                 halfyearlyFinalData
                                
                            );
                            // console.log("update success:", result);
                            if(result?.$id){
                                return true;
                            }
                            
                        }
                        
                    }

                    // console.log(newObjectMarksforHY);
                } catch (error) {
                    // console.log(error);
                    
                }
        }else if (assestType == "final") {
            
            
                // pull marks for asst-1 and asst-2 in terms of 5
                    // console.log("asst type:",assessmentId);
                    
                    try {
                        const convertedAsst3marksForHY=[];
                        const convertedAsst4marksForHY=[];
                        // assessment-3
                        const asst3 = await databases.listDocuments( 
                            databaseID, // databaseId
                            ast3, // asst 3 collectionId
                            [
                                Query.equal("name", studentname),
                                Query.equal("class", parseInt(studentclass)),
                                Query.equal("section", section),
                                Query.equal("rollno", parseInt(rollno)),
                            ] 
                        );
                            const asst3Marks = asst3.documents;
                            
                            
                            // Convert marks for each subject
                            Object.keys(subjectMarks).forEach((subject) => {
                                asst3Marks.forEach((data) => {
                                    if (data[subject] !== undefined) {
                                        const convertedData = parseFloat(data[subject]) * 0.25;
                                        convertedAsst3marksForHY.push({ [subject]: convertedData });
                                    }
                                });
                            });

                            // console.log("Converted Data:", convertedAsst3marksForHY);
                            


                        if(asst3.documents.length >0){
                            // assessment-2
                            const asst4 = await databases.listDocuments( 
                                databaseID, // databaseId
                                ast4, // asst 4 collectionId
                                [
                                    Query.equal("name", studentname),
                                    Query.equal("class", parseInt(studentclass)),
                                    Query.equal("section", section),
                                    Query.equal("rollno", parseInt(rollno)),
                                ] 
                            );
                            
                            const asst4Marks = asst4.documents;
                            
                            // Convert marks for each subject
                            Object.keys(subjectMarks).forEach((subject) => {
                                asst4Marks.forEach((data) => {
                                    if (data[subject] !== undefined) {
                                        const convertedData = parseFloat(data[subject]) * 0.25;
                                        convertedAsst4marksForHY.push({ [subject]: convertedData });
                                    }
                                });
                            });

                            // console.log("Converted Data:", convertedAsst4marksForHY);


                            if(asst3 && asst4){
                                // console.log("calculated");
                                // console.log("halfyearly marks:",subjectMarks);
                                
                                Object.keys(subjectMarks).forEach((subject) => {
                                    const mark3 = convertedAsst3marksForHY.find((ast3) => ast3[subject]);
                                    const mark4 = convertedAsst4marksForHY.find((ast4) => ast4[subject]);
                            
                                    if (mark3 && mark4) {
                                        const newMark = parseFloat(mark3[subject] + mark4[subject] + subjectMarks[subject]);
                                        // console.log("New Mark for", subject, ":", newMark);
                                        newObjectMarksforfinal[subject] = newMark;
                                        
                                    }
                                });
                                const totalMarks = calculateTotal(newObjectMarksforfinal);

                                const percentage = calculatePrecentage(totalMarks, fullMark, numSubjects);
                                // console.log("Total before update:", totalMarks);
                                // console.log("Percentage before update:", percent);



                                const finalData = {
                                    // name: studentname,
                                    // class: parseInt(studentclass),
                                    // section: section,
                                    // rollno: parseInt(rollno),
                                    // teacherId: teacherId,
                                    ...newObjectMarksforfinal, // Add subject marks
                                    total: parseFloat(totalMarks),
                                    percentage: parseFloat(percentage),
                                    status
                                };

                                for(let x in newObjectMarksforfinal){
                                    if(newObjectMarksforfinal[x] < 34){
                                        status = "FAIL"
                                        break;
                                    }
                                }
                                finalData.status = status;

                                const result = await databases.updateDocument(
                                    databaseID, // databaseId
                                    finalID, // final collectionId
                                    studentId, // documentId
                                    finalData
                                    
                                );
                                // console.log("update success:", result);
                                if(result?.$id){
                                    return true;
                                }
                                
                            }
                            
                        }

                        // console.log(newObjectMarksforfinal);
                    } catch (error) {
                        // console.log(error);
                        
                    }
            }
        else{
            // for assessment 1 and assessment 2 calculation
            for(let x in subjectMarks){
                if(subjectMarks[x] < 7){
                    status = "FAIL"
                    break;
                }
            }
            updateData.status = status;
        try {
            const result = await databases.updateDocument(
                databaseID, // databaseId
                assessmentId, // collectionId
                studentId, // documentId
                updateData
            );
            // console.log("Update success:", result);
            if(result?.$id){
                return true;
            }
        } catch (error) {
            // console.error("Update failed:", error);
            return false;
        }
        }
    };
    
    const saveMarks = async(studentname,studentclass,section,rollno,teacherId,offeredSubjects,assestType,fullMark)=>{
        const assessmentId = checkAssessment(assestType);
        // console.log("asst type:",assessmentId);
        let status="PASS"; // new added for testing status
        
        
        const subjectMarks = offeredSubjects.reduce((acc, obj) => {
        const key = Object.keys(obj)[0]; // Subject name
        acc[key] = parseInt(obj[key], 10); // Ensure integer
        return acc;
        }, {});
        // console.log("subjectMarks:",subjectMarks);
        

        // Compute total marks (sum of subject marks)
        const totalMarks = calculateTotal(subjectMarks);

        // Calculate percentage correctly
        const numSubjects = Object.keys(subjectMarks).length;
        const percent = calculatePrecentage(totalMarks, fullMark, numSubjects);

        // Construct the final object to save
        const updateData = {
            name: studentname,
            class: parseInt(studentclass),
            section: section,
            rollno: parseInt(rollno),
            teacherId: teacherId,
            ...subjectMarks, // Add subject marks
            total: parseFloat(totalMarks),
            percentage: parseFloat(percent),
            status
        };


        
        // different method of calculation for halfyearly and final
        const newObjectMarksforHY ={};
        const newObjectMarksforfinal = {};
        if(assestType == "halfyearly"){
            // pull marks for asst-1 and asst-2 in terms of 5
                // console.log("asst type:",assessmentId);
                
                try {
                    const convertedAsst1marksForHY=[];
                    const convertedAsst2marksForHY=[];
                    // assessment-1
                    const asst1 = await databases.listDocuments( 
                        databaseID, // databaseId
                        ast1, // asst 1 collectionId
                        [
                            Query.equal("name", studentname),
                            Query.equal("class", parseInt(studentclass)),
                            Query.equal("section", section),
                            Query.equal("rollno", parseInt(rollno)),
                        ] 
                    );
                        const asst1Marks = asst1.documents;
                        
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst1Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst1marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst1marksForHY);
                        


                    if(asst1.documents.length >0){
                        // assessment-2
                        const asst2 = await databases.listDocuments( 
                            databaseID, // databaseId
                            ast2, // asst 2 collectionId
                            [
                                Query.equal("name", studentname),
                                Query.equal("class", parseInt(studentclass)),
                                Query.equal("section", section),
                                Query.equal("rollno", parseInt(rollno)),
                            ] 
                        );
                        
                        const asst2Marks = asst2.documents;
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst2Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst2marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst2marksForHY);


                        if(asst1 && asst2){
                            // console.log("calculated");
                            // console.log("halfyearly marks:",subjectMarks);
                            
                            Object.keys(subjectMarks).forEach((subject) => {
                                const mark1 = convertedAsst1marksForHY.find((ast1) => ast1[subject]);
                                const mark2 = convertedAsst2marksForHY.find((ast2) => ast2[subject]);
                        
                                if (mark1 && mark2) {
                                    const newMark = parseFloat(mark1[subject] + mark2[subject] + subjectMarks[subject]);
                                    // console.log("New Mark for", subject, ":", newMark);
                                    newObjectMarksforHY[subject] = newMark;
                                }
                            });
                            const totalMarks = calculateTotal(newObjectMarksforHY);
                            const percentage = calculatePrecentage(totalMarks, fullMark, numSubjects);

                            const halfyearlyFinalData = {
                                name: studentname,
                                class: parseInt(studentclass),
                                section: section,
                                rollno: parseInt(rollno),
                                teacherId: teacherId,
                                ...newObjectMarksforHY, // Add subject marks
                                total: parseFloat(totalMarks),
                                percentage: parseFloat(percentage),
                                status
                            };
                            for(let x in newObjectMarksforHY){
                                if(newObjectMarksforHY[x] < 34){
                                    status = "FAIL"
                                    break;
                                }
                            }
                            halfyearlyFinalData.status = status;

                            const result = await databases.createDocument(
                                databaseID, // databaseId
                                halfyearlyID, //halfyearly  collectionId
                                ID.unique(), // documentId
                                halfyearlyFinalData
                                
                            );
                            // console.log("Save success:", result);
                            if(result?.$id){
                                return true;
                            }
                            
                        }
                        
                    }

                    // console.log(newObjectMarksforHY);
                    


                } catch (error) {
                    // console.log(error);
                    
                }
        }else if (assestType == "final") {
            
            
            // pull marks for asst-1 and asst-2 in terms of 5
                // console.log("asst type:",assessmentId);
                
                try {
                    const convertedAsst3marksForHY=[];
                    const convertedAsst4marksForHY=[];
                    // assessment-3
                    const asst3 = await databases.listDocuments( 
                        databaseID, // databaseId
                        ast3, // asst 3 collectionId
                        [
                            Query.equal("name", studentname),
                            Query.equal("class", parseInt(studentclass)),
                            Query.equal("section", section),
                            Query.equal("rollno", parseInt(rollno)),
                        ] 
                    );
                        const asst3Marks = asst3.documents;
                        
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst3Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst3marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst3marksForHY);
                        


                    if(asst3.documents.length >0){
                        // assessment-4
                        const asst4 = await databases.listDocuments( 
                            databaseID, // databaseId
                            ast4, // asst 4  collectionId
                            [
                                Query.equal("name", studentname),
                                Query.equal("class", parseInt(studentclass)),
                                Query.equal("section", section),
                                Query.equal("rollno", parseInt(rollno)),
                            ] 
                        );
                        
                        const asst4Marks = asst4.documents;
                        
                         // Convert marks for each subject
                        Object.keys(subjectMarks).forEach((subject) => {
                            asst4Marks.forEach((data) => {
                                if (data[subject] !== undefined) {
                                    const convertedData = parseFloat(data[subject]) * 0.25;
                                    convertedAsst4marksForHY.push({ [subject]: convertedData });
                                }
                            });
                        });

                        // console.log("Converted Data:", convertedAsst4marksForHY);


                        if(asst3 && asst4){
                            // console.log("calculated");
                            // console.log("halfyearly marks:",subjectMarks);
                            
                            Object.keys(subjectMarks).forEach((subject) => {
                                const mark3 = convertedAsst4marksForHY.find((ast3) => ast3[subject]);
                                const mark4 = convertedAsst4marksForHY.find((ast4) => ast4[subject]);
                        
                                if (mark3 && mark4) {
                                    const newMark = parseFloat(mark3[subject] + mark4[subject] + subjectMarks[subject]);
                                    console.log("New Mark for final", subject, ":", newMark);
                                    newObjectMarksforfinal[subject] = newMark;
                                }
                            });
                            const totalMarks = calculateTotal(newObjectMarksforfinal);
                            const percentage = calculatePrecentage(totalMarks, fullMark, numSubjects);

                            const finalData = {
                                name: studentname,
                                class: parseInt(studentclass),
                                section: section,
                                rollno: parseInt(rollno),
                                teacherId: teacherId,
                                ...newObjectMarksforfinal, // Add subject marks
                                total: parseFloat(totalMarks),
                                percentage: parseFloat(percentage),
                                status
                            };

                            for(let x in newObjectMarksforfinal){
                                if(newObjectMarksforfinal[x] < 34){
                                    status = "FAIL"
                                    break;
                                }
                            }
                            finalData.status = status;

                            const result = await databases.createDocument(
                                databaseID, // databaseId
                                finalID, // final collectionId
                                ID.unique(), // documentId
                                finalData
                                
                            );
                            // console.log("Save success:", result);
                            if(result?.$id){
                                return true;
                            }
                            
                        }
                        
                    }

                    // console.log(newObjectMarksforfinal);
                    


                } catch (error) {
                    // console.log(error);
                    
                }
        }
        else{
            for(let x in subjectMarks){
                if(subjectMarks[x] < 7){
                    status = "FAIL"
                    break;
                }
            }
            updateData.status = status;
            try {
                const result = await databases.createDocument(
                    databaseID, // databaseId
                    assessmentId, // collectionId
                    ID.unique(), // documentId
                    updateData
                );
                // console.log("Save success:", result);
                if(result?.$id){
                    return true;
                }
            } catch (error) {
                // console.error("Saving failed:", error);
                return false;
            }
        }
        // console.log(studentname,studentclass,section,rollno,teacherId);
        // console.log(updateData);
    }


    const fetchAssessmentForRanks = async(assesstmentType,teacherId)=>{
        const assessmentId = checkAssessment(assesstmentType);
        if (assessmentId && teacherId) {
            try {
                const result = await databases.listDocuments(
                    databaseID, // databaseId
                     assessmentId, // collectionId
                );
                // console.log(result);
                return result.documents;
                
            } catch (error) {
                // console.log(error);
                
            }
        }
    }
    
    
    
    export {
            signupApp,
            loginApp,
            appLogout,
            getCurrentUser,
            createProfile,
            updateProfile,
            fetchProfileData,
            fetchMyStudents,
            checkStudentExist,
            submitSettings,
            fetchAssessmentDetails,
            fetchSavedAssessmentList,
            deleteAssessment,
            formatAsssesmentName,
            saveMarks,
            updateMarks,
            fetchAssessmentForRanks, 
         };
