import { useState } from "react"
import axios from "axios"
import { useEffect } from "react";


const StudentForm = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [students, setStudents] = useState([]); // Store the list
    const [editId, setEditId] = useState(null);
    const [view, setView] = useState("form");//Decides to show table or form

    const[formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        rollNo: '',
        collegeName: '',
        subjects: [], // Array for multiple selection
        regId: '',
        bio: ''
    });

    //Fetch your data
    const fetchStudents = async () => {
        try{
            const res = await axios.get('http://localhost:5000/api/students')
            setStudents(res.data);
        } catch(err){
            console.log('Fetch Error : ', err);
        }
    };

    useEffect(() => {
        fetchStudents(); //Show the data
    }, []);

    //Delete function
    const handleDelete = async(id) => {
        if(window.confirm('Are you sure to delete this student?')){
            try{
                await axios.delete(`http://localhost:5000/api/students/${id}`);
                alert('Student Deleted Successfully..');
                fetchStudents();
            } catch(err){
                alert("Delete failed");
            }
        }
    };


//To handle changes in input fields
const handleSubjectChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for(let i=0; i<options.length; i++){
        if(options[i].selected){
            selectedValues.push(options[i].value);
        }
    }
    setFormData({ ...formData, subjects: selectedValues });
};

//Create form and update
const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        if (editId) {
            const res = await axios.put(`http://localhost:5000/api/students/${editId}`, formData);
            alert(res.data.message);
        } else {
            const res = await axios.post('http://localhost:5000/api/students', formData);
            console.log(res.data);
            alert('Success: ' + res.data.message);
        }
        fetchStudents(); //Refresh the list

        setEditId(null); //reset editID after submission
        //form reset
        setFormData({
                name: '',
                email: '', 
                phone: '', 
                age: '', 
                rollNo: '', 
                collegeName: '', 
                subjects: [], 
                regId: '', 
                bio: ''
            });   
            setView("table");   
    } catch(err){
        alert('Error : ' + (err.response?.data?.error) ||'Server Error');
    }
};

return (
    <div className="container">
        {/* Switch button */}
        <button 
            onClick={() => setView(view === "form" ? "table" : "form")}
            style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#67a7b0ff' }}
        >
            {view === "form" ? "View Registered Students →" : "← Back to Registration"}
        </button>
        

        {view === "form" && (
            <>
        <h2>{editId ? "Update Student" : "Student Registration"}</h2>
        <form onSubmit={handleSubmit} className="student-form">
            <input type="text" placeholder="Full Name" value={formData.name}
            onChange={(e) => setFormData({...formData, name:e.target.value})} required/>
            
            <input type="email" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({...formData, email:e.target.value})} required/>
            
            <input type="tel" placeholder="Phone Number" value={formData.phone}
            onChange={(e) => setFormData({...formData, phone:e.target.value})} required/>
            
            <input type="number" placeholder="Age" value={formData.age}
            onChange={(e) => setFormData({...formData, age:e.target.value})} required />
            
            <input type="text" placeholder="Roll Number" value={formData.rollNo}
            onChange={(e) => setFormData({...formData, rollNo:e.target.value})} required/>
            
            <input type="text" placeholder="College Name" value={formData.collegeName}
            onChange={(e) => setFormData({...formData, collegeName:e.target.value})} required/>
            
            <input type="text" placeholder="Registration ID" value={formData.regId}
            onChange={(e) => setFormData({...formData, regId:e.target.value})} />
        

            <div className="full-width" style={{ position: 'relative' }}>
            <label>Subjects:</label>
            <div onClick={() => setShowDropdown(!showDropdown)} className="selected-subjects-box">
            {formData.subjects.length > 0 ? formData.subjects.join(', ') : "Select Subjects..."}
            </div>

            {showDropdown && (
            <div className="dropdown-container">
            <select 
                multiple={true} 
                value={formData.subjects} 
                onChange={handleSubjectChange}
                className="dropdown-select"
            >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
            </select>
            </div> )}
        </div>
            
            <textarea className="full-width" placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio:e.target.value})} required />

            <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                Register Student
            </button>

        </form>
            </>
        )}

        {view === "table" && (
        <div className="table-container">
            <h3 className="table-title">Registered Students List</h3>
            <div className="table-wrapper">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Age</th>
                            <th>Roll No.</th>
                            <th>College Name</th>
                            <th>Subjects</th>
                            <th>Registration ID</th>
                            <th>Bio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s._id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.age}</td>
                            <td>{s.rollNo}</td>
                            <td>{s.collegeName}</td>
                            <td>{s.subjects.join(', ')}</td>
                            <td>{s.regId}</td>
                            <td title={s.bio} className="bio-cell">{s.bio}</td>
                            <td className="action-buttons">
                                <button className="btn-edit"
                                    onClick={() => {
                                    setEditId(s._id);
                                    setFormData(s);
                                    setView("form");
                                    window.scrollTo(0,0);
                                }} > Edit</button>

                                {/* Delete Button */}
                            <button className="btn-delete"
                                onClick={() => handleDelete(s._id)} >
                                Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
        )}
    </div>
    )
};

export default StudentForm;
