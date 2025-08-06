import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import arrow from '../../assets/drop-arrow.png'

const QuestionModels = ({ onClose }) => {

  const [selectedLevel, setSelectedLevel] = useState("Beginner");

  const [openType, setOpenType] = useState(false);
  const [selectedType, setSelectedType] = useState("MCQ");

  const [openLanguage, setOpenLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("German");

  const levels = ['Beginner', 'Intermediate', 'Fluent/Native']

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="w-[60%] max-w-[800px] flex flex-col gap-5 bg-white p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-semibold">Add Questions</h2>

        <div className="flex-1 max-h-[460px] overflow-y-auto pr-2 mt-4">

            <form className="w-full flex flex-col justify-center gap-5 mx-auto">

                {/* level */}
                <div className="flex items-center gap-3">
                    {levels.map((item) => (
                        <p 
                         key={item} 
                         onClick={() => setSelectedLevel(item)}
                         className={`px-5 py-2 text-sm rounded-xl cursor-pointer transition ${
                            selectedLevel === item
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
                            {selectedType}
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
                                            setSelectedType("MCQ");
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
                            {selectedLanguage}
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
                                            setSelectedLanguage("English");
                                            setOpenLanguage(false);
                                        }}
                                    >
                                        English
                                    </li>
                                    <li
                                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedLanguage("German");
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
                        className='w-20 border border-[#0000001C] text-sm outline-none rounded-lg p-2 text-center'
                        />
                    </div>

                    {/* Negative Marks */}
                    <div className="flex items-center justify-start gap-2">
                        <label className='font-medium' htmlFor="negative">Negative</label>
                        <input 
                        id='negative' 
                        type="number"
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
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#2c6472] transition-all"></div>
                            <span className="absolute left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transform transition-all"></span>
                        </label>
                    </div>

                    {/* Randomize */}
                    <div className="w-1/4 flex items-center justify-center gap-2">
                        <label className="font-medium" htmlFor="random">Randomize</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="active"
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
                    className='border border-[#0000001C] text-sm outline-none rounded-xl p-3'
                    />
                </div>
                
                {/* Option Choices */}
                <div className="w-1/2 flex flex-col justify-center gap-3">
                    <p className='font-medium'>Option Choices</p>

                    {/* Option 1 */}
                    <div className="flex items-center gap-3">
                        <input
                        type="radio"
                        name="correctOption"
                        className="w-5 h-5 accent-[#2c6472] cursor-pointer"
                        />
                        <input
                        type="text"
                        placeholder="Option 1"
                        className="flex-1 border border-[#0000001C] text-sm outline-none rounded-xl p-3"
                        />
                    </div>
                    
                    {/* Option 2 */}
                    <div className="flex items-center gap-3">
                        <input
                        type="radio"
                        name="correctOption"
                        className="w-5 h-5 accent-[#2c6472] cursor-pointer"
                        />
                        <input
                        type="text"
                        placeholder="Option 2"
                        className="flex-1 border border-[#0000001C] text-sm outline-none rounded-xl p-3"
                        />
                    </div>
                    
                    {/* Option 3 */}
                    <div className="flex items-center gap-3">
                        <input
                        type="radio"
                        name="correctOption"
                        className="w-5 h-5 accent-[#2c6472] cursor-pointer"
                        />
                        <input
                        type="text"
                        placeholder="Option 3"
                        className="flex-1 border border-[#0000001C] text-sm outline-none rounded-xl p-3"
                        />
                    </div>
                    
                    {/* Option 4 */}
                    <div className="flex items-center gap-3">
                        <input
                        type="radio"
                        name="correctOption"
                        className="w-5 h-5 accent-[#2c6472] cursor-pointer"
                        />
                        <input
                        type="text"
                        placeholder="Option 4"
                        className="flex-1 border border-[#0000001C] text-sm outline-none rounded-xl p-3"
                        />
                    </div>                
                </div>

                {/* Explanation */}
                <div className="w-full flex flex-col justify-center gap-2">
                    <label className='font-medium' htmlFor="explanation">Explanation</label>
                    <textarea
                     id="explanation"
                     rows={4} // Adjust height
                     className="border border-[#0000001C] text-sm outline-none rounded-xl p-3 resize-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-5 py-4 mt-4">
                    <button 
                    className='w-40 py-2 text-[#2c6472] text-sm border border-[#2c6472] rounded-lg cursor-pointer'
                    onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button className='w-40 py-2 bg-[#2c6472] text-sm text-white rounded-lg cursor-pointer'>
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