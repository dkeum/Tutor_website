import React, { useEffect, useState } from 'react'
import NavbarLoggedIn from '../components/NavbarLoggedIn'


const SolveProblems = () => {

  const [questions, setQuestions] = useState()
  const [answer, setAnswer] = useState([])
  const [recordedAnswer, setRecordedAnswer] = useState([])

        // Feedback from a real tutor
    // AI tutor integrated (3D three.js)
    // integrated with desmo graph

    useEffect(()=>{


      const response =  axios.get(
        import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
          ? "http://localhost:3000/section"
          : "https://mathamagic-backend.vercel.app/section",
        {
          withCredentials: true, // ⬅️ very important!
        }
      );

      // get the questions and answers from response
      // 
    })
    
  return (
    <div>
      <NavbarLoggedIn/>

      <div>
       
      </div>

    </div>
  )
}

export default SolveProblems