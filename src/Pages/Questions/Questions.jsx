import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../Components/Navbar/Navbar'
import ellipsis from '../../assets/ellipsis.svg'
import QuestionModal from '../../Components/PopUps/QuestionModels'

const Questions = () => {

  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState("Beginner");
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    per_page: 20
  });




  const levels = ["All", "Beginner", "Intermediate", "Fluent/Native"];

  // Fetch Questions
  const fetchQuestions = async (page = 1) => {
    try {

      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }
      const res = await fetch('https://a1.arshan.digital/a1/admin/exam/questions', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if (!res.ok) {
        toast.error('Failed to fetch Questions')
        return;
      }
      const data = await res.json();
      setAllQuestions(data.questions || []);
      setQuestions(data.questions || []);

      if (data.pagination) {
        setPagination({
          current: data.pagination.current,
          total: Math.ceil(data.pagination.total / data.pagination.per_page),
          per_page: data.pagination.per_page
        });
      }

    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  // Initial load
  useEffect(() => {
    fetchQuestions(pagination.current);
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }

      const res = await fetch(`https://a1.arshan.digital/a1/admin/exam/questions/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        toast.error('Failed to delete question');
        return;
      }

      toast.success('Question deleted successfully');
      setQuestions(prev => prev.filter(q => q.question_id !== id));
    }
    catch (error) {
      toast.error("Something went wrong!");
    }
  }

  // Focus Blur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center px-8 py-5">

        <div className="flex gap-10">
          {levels.map((item) => (
            <button
              key={item}
              className={`w-[160px] px-3 py-3 flex justify-center items-center rounded-xl 
      ${level === item ? "bg-[#2c6472] text-white" : "bg-transparent text-[#2c6472] border border-[#2c6472]"}`}
              onClick={() => {
                setLevel(item);
                if (item === "All") {
                  setQuestions(allQuestions);
                } else {
                  const filtered = allQuestions.filter(q =>
                    q.difficulty?.toLowerCase() === item.toLowerCase()
                  );
                  setQuestions(filtered);
                }
              }}
            >
              <p className='font-medium'>{item}</p>
            </button>
          ))}


        </div>

        <button
          onClick={() => setShowModal(true)}
          className='text-white bg-[#2c6472] rounded-xl px-8 py-3 cursor-pointer'
        >
          + Add Questions
        </button>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3 px-8 pt-3 pb-5">

        {questions.map((q, index) => (

          <div key={q.question_id} className="relative flex flex-col gap-3 bg-white px-5 py-3 border border-[#0000001F] rounded-xl">
            <h2 className='font-semibold'>{index + 1}. {q.question}</h2>

            <div className="font-medium text-[#0000006F] flex gap-5">
              <p>Marks: <span className='font-normal'>{q.marks || 0}</span></p>
              <p>Language: <span className='font-normal'>{q.language || "N/A"}</span></p>
              <p>Type: <span className='font-normal'>{(q.type || "N/A").toUpperCase()}</span></p>
              <p>Status: <span className='font-normal'>{q.is_active ? "Active" : "Inactive"}</span></p>
            </div>

            <div className="flex flex-col gap-3 font-medium">
              {q.options?.map((opt, idx) => (
                <label key={`${q.question_id}-${idx}`} className="flex items-center gap-5 cursor-pointer w-fit">
                  <input
                    type="radio"
                    name={`q${index}`}
                    className="w-4 h-4 accent-[#2c6472]"
                    checked={opt.is_correct}
                    readOnly
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>

            <div
              ref={menuRef}
              onClick={() => setOpen(open === q.question_id ? null : q.question_id)}
              className="absolute top-2 right-2 flex items-center rounded-full hover:bg-[#2c6472]/10 p-2 aspect-square cursor-pointer">
              <img src={ellipsis} className='w-4' alt="" />
            </div>

            <AnimatePresence>

              {open === q.question_id && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute right-2 top-10 w-40 bg-white border border-[#0000001F] rounded-md z-10"
                >
                  <ul className="p-2 text-left text-sm">
                    <li
                      onClick={() => {
                        setSelectedQuestion(q); // store the whole question object
                        setShowModal(true);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                    <li
                      onClick={() => handleDelete(q.question_id)}
                      className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                    >
                      Remove
                    </li>
                  </ul>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        ))}

        {showModal &&
          <QuestionModal
            onClose={() => {
              setShowModal(false);
              setSelectedQuestion(null);
            }}
            onSuccess={() => fetchQuestions()}
            initialData={selectedQuestion} // pass data
          />
        }

      </div>

      <div className="flex justify-center items-center gap-8 py-10 px-8">
        <button
          disabled={pagination.current === 1}
          onClick={() => fetchQuestions(pagination.current - 1)}
          className={`px-3 py-1 rounded-md cursor-pointer ${pagination.current === 1 ? 'bg-gray-300' : 'bg-[#2c6472] text-white'
            }`}
        >
          Prev
        </button>

        <p>{pagination.current} of {pagination.total}</p>

        <button
          disabled={pagination.current === pagination.total}
          onClick={() => fetchQuestions(pagination.current + 1)}
          className={`px-3 py-1 rounded-md cursor-pointer ${pagination.current === pagination.total ? 'bg-gray-300 ' : 'bg-[#2c6472] text-white'
            }`}
        >
          Next
        </button>
      </div>


    </div>
  )
}

export default Questions