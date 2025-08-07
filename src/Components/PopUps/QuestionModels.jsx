import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from "framer-motion";
import arrow from '../../assets/drop-arrow.png'

const QuestionModels = ({ onClose, onSuccess }) => {

  const [questionData, setQuestionData] = useState({
    question_id: "",
    type: "mcq",
    title: "",
    description: "",
    question: "",
    options: [
      { id: "opt1", text: "", media: "", is_correct: false },
      { id: "opt2", text: "", media: "", is_correct: false },
      { id: "opt3", text: "", media: "", is_correct: false },
      { id: "opt4", text: "", media: "", is_correct: false },
    ],
    correct_option_ids: [],
    answer_key: "",
    marks: "",
    negative_mark: "",
    difficulty: "Beginner",
    language: "German",
    randomize_options: false,
    tags: [],
    category: "",
    sub_category: "",
    attachments: [],
    explanation: "",
    is_active: true
  })

  const [openType, setOpenType] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);

  const levels = ['Beginner', 'Intermediate', 'Fluent/Native']

  const handleInputChange = (field, value) => {
    setQuestionData(prev => ({ ...prev, [field]: value }));
  };

  // Update options
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = {
        ...updatedOptions[index],
        id: updatedOptions[index].id || `opt${index + 1}`,
        text: value
    };
    setQuestionData(prev => ({ ...prev, options: updatedOptions }));
  };


  // Select correct option
  const handleCorrectOption = (index) => {
    const updatedOptions = questionData.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index
    }));
    setQuestionData(prev => ({
      ...prev,
      options: updatedOptions,
      correct_option_ids: [`opt${index + 1}`],
      answer_key: updatedOptions[index].text
    }));
  };

  // Generate unique question ID
  const generateQuestionID = () => {
    const now = new Date();
    return `QB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Date.now()}`;
  };

  // Prepare data: Replace null/empty with defaults
  const preparePayload = () => {
    const payload = { ...questionData };

    if (!payload.question_id) {
        payload.question_id = generateQuestionID();
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === null || payload[key] === "") {
        if (key === "marks" || key === "negative_mark") {
          payload[key] = 0.0;
        } else if (Array.isArray(payload[key])) {
          payload[key] = [];
        } else {
          payload[key] = "";
        }
      }
    });

    payload.marks = parseFloat(payload.marks) || 0.0;
    payload.negative_mark = parseFloat(payload.negative_mark) || 0.0;

    payload.options = payload.options.map((opt, i) => ({
      id: opt.id || `opt${i + 1}`,
      text: opt.text || `Option ${i + 1}`,
      media: opt.media || "",
      is_correct: !!opt.is_correct
    }));

    payload.correct_option_ids = payload.options.filter(opt => opt.is_correct).map(opt => opt.id);

    const correctOpt = payload.options.find(opt => opt.is_correct);
    payload.answer_key = correctOpt ? correctOpt.text : "";

    payload.title = payload.title || "Untitled Question";
    payload.description = payload.description || "No description provided.";
    payload.category = payload.category || "General";
    payload.sub_category = payload.sub_category || "Miscellaneous";
    payload.explanation = payload.explanation || "No explanation provided.";
    payload.tags = payload.tags.length ? payload.tags : ["general"];

    const now = new Date().toISOString();
    payload.created_at = now;
    payload.updated_at = now;

    return payload;
  };

  // Post Questions
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = preparePayload();
    console.log("Payload being sent:", payload);

    if (!payload.question.trim()) {
        toast.error("Please enter the question.");
        return;
    }

    if (payload.correct_option_ids.length === 0) {
        toast.error("Please select the correct option.");
        return;
    }

    try {
        const token = sessionStorage.getItem('token');
        if(!token) {
            toast.error("No User found. Please log in.");
            return;
        }

        const res = await fetch('https://a1.arshan.digital/a1/admin/exam/questions', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })

        if(!res.ok) {
            toast.error('Failed to Update Question')
            return;
        }

        const data = await res.json();
        console.log("Response:", data);
        if (onSuccess) onSuccess();
        onClose();
        
    } catch (error) {
        toast.error("Something went wrong!");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="w-[60%] max-w-[800px] flex flex-col gap-5 bg-white p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-semibold">Add Questions</h2>

        <div className="flex-1 max-h-[460px] overflow-y-auto pr-2 mt-4">

            <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center gap-5 mx-auto">

                {/* level */}
                <div className="flex items-center gap-3">
                    {levels.map((item) => (
                        <p 
                         key={item} 
                         onClick={() => handleInputChange("difficulty", item)}
                         className={`px-5 py-2 text-sm rounded-xl cursor-pointer transition ${
                            questionData.difficulty === item
                            ? "bg-[#2c6472] text-white"
                            : "bg-white text-[#2c6472] border border-[#2c6472]"
                         }`}
                        >
                            { item }
                        </p>
                    ))}
                </div>

                <div className="flex gap-5 w-full">

                    {/* Type */}
                    <div className="relative flex flex-col gap-3 w-1/2">
                        <label htmlFor="type" className="font-medium">Type</label>

                        {/* Selected Type (Clickable) */}
                        <div
                            className="border border-[#0000001C] text-sm rounded-xl p-3 cursor-pointer bg-white flex justify-between items-center"
                            onClick={() => setOpenType((prev) => !prev)}
                        >
                            {questionData.type.toUpperCase()}
                            <img src={arrow} alt="" className={`w-3 h-2 transform transition-transform ${openType ? "rotate-180" : ""}`} />
                        </div>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {openType && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full mt-1 left-0 w-full bg-white border border-[#0000001C] rounded-xl shadow-lg z-50"
                                >
                                    <li
                                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleInputChange("type", "mcq");
                                            setOpenType(false);
                                        }}
                                    >
                                        MCQ
                                    </li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Language */}
                    <div className="relative flex flex-col gap-3 w-1/2">
                        <label htmlFor="language" className="font-medium">Language</label>

                        <div
                            className="border border-[#0000001C] text-sm rounded-xl p-3 cursor-pointer bg-white flex justify-between items-center"
                            onClick={() => setOpenLanguage((prev) => !prev)}
                        >
                            {questionData.language}
                            <img
                                src={arrow}
                                alt=""
                                className={`w-3 h-2 transform transition-transform ${openLanguage ? "rotate-180" : ""}`}
                            />
                        </div>

                        <AnimatePresence>
                            {openLanguage && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full mt-1 left-0 w-full bg-white border border-[#0000001C] rounded-xl shadow-lg z-50"
                                >
                                    <li
                                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleInputChange("language", "English");
                                            setOpenLanguage(false);
                                        }}
                                    >
                                        English
                                    </li>
                                    <li
                                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleInputChange("language", "German");
                                            setOpenLanguage(false);
                                        }}
                                    >
                                        German
                                    </li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                <div className="flex gap-5 py-1">
                    {/* Marks */}
                    <div className="w-1/4 flex items-center justify-start gap-2">
                        <label className='font-medium' htmlFor="marks">Marks</label>
                        <input 
                        id='marks' 
                        type="number"
                        value={questionData.marks}
                        onChange={(e) => handleInputChange("marks", e.target.value === "" ? "" : parseInt(e.target.value))}
                        className='w-20 border border-[#0000001C] text-sm outline-none rounded-lg p-2 text-center'
                        />
                    </div>

                    {/* Negative Marks */}
                    <div className="flex items-center justify-start gap-2">
                        <label className='font-medium' htmlFor="negative">Negative</label>
                        <input 
                        id='negative' 
                        type="number"
                        value={questionData.negative_mark}
                        onChange={(e) => handleInputChange("negative_mark", e.target.value === "" ? "" : parseInt(e.target.value))}
                        className='w-20 border border-[#0000001C] text-sm outline-none rounded-lg p-2 text-center'
                        />
                    </div>

                    {/* Active */}
                    <div className="w-1/4 flex items-center justify-center gap-2">
                        <label className="font-medium" htmlFor="active">Active</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="active"
                                checked={questionData.is_active}
                                onChange={(e) => handleInputChange("is_active", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-all"></div>
                            <span className="absolute left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></span>
                        </label>
                    </div>

                </div>
                    
                {/* Question */}
                <div className="w-full flex flex-col justify-center gap-2">
                    <label className='font-medium' htmlFor="question">Question</label>
                    <input 
                    id='question' 
                    type="text"
                    value={questionData.question}
                    onChange={(e) => handleInputChange("question", e.target.value)}
                    className='border border-[#0000001C] text-sm outline-none rounded-xl p-3'
                    />
                </div>
                
                {/* Option Choices */}
                <div className="w-1/2 flex flex-col justify-center gap-3">
                    <p className='font-medium'>Option Choices</p>
                    {questionData.options.map((opt, index) => (
                        <div key={opt.id || `option-${index}`} className="flex items-center gap-3">
                            <input
                            type="radio"
                            name="correctOption"
                            checked={opt.is_correct}
                            onChange={() => handleCorrectOption(index)}
                            className="w-5 h-5 accent-[#2c6472] cursor-pointer"
                            />
                            <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={opt.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 border border-[#0000001C] text-sm outline-none rounded-xl p-3"
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-5 py-4 mt-4">
                    <button 
                    className='w-40 py-2 text-[#2c6472] text-sm border border-[#2c6472] rounded-lg cursor-pointer'
                    onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className='w-40 py-2 bg-[#2c6472] text-sm text-white rounded-lg cursor-pointer'>
                        Post
                    </button>
                </div>

            </form>

        </div>
        
      </div>

    </div>
  )
}

export default QuestionModels