import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookmarkIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, CheckCircleIcon as CheckSolidIcon } from '@heroicons/react/24/solid';

const Practice = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const questionsPerPage = 10;

  // Mock data - replace with actual API call
  const mockQuestions = [
    {
      id: 1,
      title: "Two Sum",
      category: "Array",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      answer: "Use a hash map to store the complement of each number as you iterate through the array.",
      tags: ["Array", "Hash Table"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    {
      id: 2,
      title: "Reverse Linked List",
      category: "Linked List",
      difficulty: "Easy",
      description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      answer: "Use three pointers: prev, current, and next. Iterate through the list and reverse the links.",
      tags: ["Linked List", "Recursion"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    },
    {
      id: 3,
      title: "Binary Tree Inorder Traversal",
      category: "Tree",
      difficulty: "Medium",
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      answer: "Use recursion or iterative approach with a stack to traverse left subtree, root, then right subtree.",
      tags: ["Tree", "Stack", "Recursion"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(h)"
    },
    {
      id: 4,
      title: "Maximum Subarray",
      category: "Dynamic Programming",
      difficulty: "Medium",
      description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
      answer: "Use Kadane's algorithm to find the maximum sum subarray in linear time.",
      tags: ["Array", "Dynamic Programming"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    },
    {
      id: 5,
      title: "Merge k Sorted Lists",
      category: "Linked List",
      difficulty: "Hard",
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      answer: "Use a min-heap or divide and conquer approach to efficiently merge all lists.",
      tags: ["Linked List", "Heap", "Divide and Conquer"],
      timeComplexity: "O(n log k)",
      spaceComplexity: "O(k)"
    }
  ];

  const categories = ['all', 'Array', 'Linked List', 'Tree', 'Dynamic Programming', 'String', 'Graph'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuestions(mockQuestions);
      setFilteredQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = questions;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredQuestions(filtered);
    setCurrentPage(1);
  }, [questions, selectedCategory, selectedDifficulty, searchTerm]);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, startIndex + questionsPerPage);

  const toggleComplete = (questionId) => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(questionId)) {
      newCompleted.delete(questionId);
    } else {
      newCompleted.add(questionId);
    }
    setCompletedQuestions(newCompleted);
  };

  const toggleBookmark = (questionId) => {
    const newBookmarked = new Set(bookmarkedQuestions);
    if (newBookmarked.has(questionId)) {
      newBookmarked.delete(questionId);
    } else {
      newBookmarked.add(questionId);
    }
    setBookmarkedQuestions(newBookmarked);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading practice questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Questions</h1>
          <p className="text-gray-600">Sharpen your skills with curated interview questions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedQuestions.size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookmarkIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bookmarked</p>
                <p className="text-2xl font-semibold text-gray-900">{bookmarkedQuestions.size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{questions.length - completedQuestions.size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Questions</p>
                <p className="text-2xl font-semibold text-gray-900">{questions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty === 'all' ? 'All Difficulties' : difficulty}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow">
          {currentQuestions.length === 0 ? (
            <div className="p-12 text-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {currentQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{question.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{question.category}</span>
                          <span>Time: {question.timeComplexity}</span>
                          <span>Space: {question.spaceComplexity}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(question.id);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          {completedQuestions.has(question.id) ? (
                            <CheckSolidIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <CheckCircleIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(question.id);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          {bookmarkedQuestions.has(question.id) ? (
                            <BookmarkSolidIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <BookmarkIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {startIndex + 1} to {Math.min(startIndex + questionsPerPage, filteredQuestions.length)} of {filteredQuestions.length} results
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      
                      <span className="px-4 py-2 text-sm font-medium">
                        {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Question Detail Modal */}
        <AnimatePresence>
          {selectedQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedQuestion(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedQuestion.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                          {selectedQuestion.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">{selectedQuestion.category}</span>
                        <span>Time: {selectedQuestion.timeComplexity}</span>
                        <span>Space: {selectedQuestion.spaceComplexity}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedQuestion.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution Approach</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedQuestion.answer}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuestion.tags.map(tag => (
                          <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => toggleComplete(selectedQuestion.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                          completedQuestions.has(selectedQuestion.id)
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {completedQuestions.has(selectedQuestion.id) ? (
                          <CheckSolidIcon className="h-5 w-5" />
                        ) : (
                          <CheckCircleIcon className="h-5 w-5" />
                        )}
                        {completedQuestions.has(selectedQuestion.id) ? 'Completed' : 'Mark Complete'}
                      </button>

                      <button
                        onClick={() => toggleBookmark(selectedQuestion.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                          bookmarkedQuestions.has(selectedQuestion.id)
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {bookmarkedQuestions.has(selectedQuestion.id) ? (
                          <BookmarkSolidIcon className="h-5 w-5" />
                        ) : (
                          <BookmarkIcon className="h-5 w-5" />
                        )}
                        {bookmarkedQuestions.has(selectedQuestion.id) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Practice;