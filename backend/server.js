const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully......'))
    .catch(err => console.log('MongoDB connection error:', err))

//Routes (Create)
app.post('/api/students', async(req, res) => {
    try{
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({newStudent, message : 'Student Added Successfully...'})
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

// Read the data
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find(); 
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//To get a single student data
app.get('/api/students/:id', async(req, res) => {
    try{
        const student = await Student.findById(req.params.id);
        console.log(student);
        if(!student){
            return res.status(404).json({message : 'Student not found'})
        }
        res.json(student);

    } catch(err){
        res.status(500).json({ error:err.message });
    }
})

//update the data
app.put('/api/students/:id', async(req, res) => {
    try{
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({updatedStudent, message: 'Student Updated Successfully...'})
    } catch(err){
        res.status(500).json({ error: err.message });
    }
    
})

//Delete the data
app.delete('/api/students/:id', async(req, res) => {
    try{
        const id = req.params.id;
        await Student.findByIdAndDelete(id);
        res.status(200).send({ message: 'Student Deleted Successfully...'});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
    
})


app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})