import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCdJXwDLwneSJQuDLpRT9l2OiAm7TJC61E",
    authDomain: "smit-projects-59cf9.firebaseapp.com",
    projectId: "smit-projects-59cf9",
    storageBucket: "smit-projects-59cf9.firebasestorage.app",
    messagingSenderId: "585656771043",
    appId: "1:585656771043:web:7f917579468224872500d6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getdata = async () => {
    const data = [];
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data(), id: doc.id }); // Include the document ID
        });
    } catch (e) {
        console.error("Error fetching data: ", e);
    }
    return data;
};


const addData = async (user) => {
    try {
        const docRef = await addDoc(collection(db, "users"), user);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function delData (docId) {
    try {
        await deleteDoc(doc(db, "users", docId));
        console.log(`Document with ID ${docId} deleted successfully.`);
        alert('deleted successfully.')
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

export {
    getdata,
    addData,
    delData
}